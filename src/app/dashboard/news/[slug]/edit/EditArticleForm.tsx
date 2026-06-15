"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckCircle2,
  ChevronDown,
  Code2,
  Columns3,
  Eye,
  FileText,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  Monitor,
  Palette,
  Quote,
  Save,
  Search,
  Smartphone,
  Table2,
  Type,
  Underline,
  WrapText,
  Send,
  X,
} from "lucide-react";

import type { NewsItem } from "@/data/news";

const categories = ["سياسة", "اقتصاد", "تكنولوجيا", "ثقافة"];

type EditArticleFormProps = {
  article: NewsItem;
  articles: NewsItem[];
  hasDraft: boolean;
};

type TableDesktopWidth = "narrow" | "wide" | "full";
type TableMobileMode = "scroll" | "stack";
type TableTextSize = "sm" | "md";
type PreviewDevice = "desktop" | "mobile";
type SaveMode = "draft" | "published";
type SearchTarget = "editor" | "html";

type EditableArticlePayload = Pick<
  NewsItem,
  | "title"
  | "slug"
  | "category"
  | "author"
  | "date"
  | "image"
  | "excerpt"
  | "description"
  | "content"
> & {
  updatedAt: string;
};

type ArticleImportField = keyof Pick<
  NewsItem,
  | "title"
  | "slug"
  | "category"
  | "author"
  | "date"
  | "image"
  | "excerpt"
  | "description"
  | "content"
>;

type ArticleImportPayload = Partial<Record<ArticleImportField, string>>;

const articleImportFields = [
  "title",
  "slug",
  "category",
  "author",
  "date",
  "image",
  "excerpt",
  "description",
] as const;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const unescapeImportValue = (value: string) =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\(["'`\\])/g, "$1")
    .trim();

const extractQuotedImportField = (source: string, field: ArticleImportField) => {
  const match = new RegExp(
    `${escapeRegex(field)}\\s*:\\s*(["'])([\\s\\S]*?)\\1\\s*,?`,
    "m"
  ).exec(source);

  return match?.[2] ? unescapeImportValue(match[2]) : undefined;
};

const extractTemplateImportField = (
  source: string,
  field: ArticleImportField
) => {
  const marker = new RegExp(`${escapeRegex(field)}\\s*:\\s*\``).exec(source);
  if (!marker) return undefined;

  const startIndex = marker.index + marker[0].length;

  for (let index = startIndex; index < source.length; index += 1) {
    if (source[index] === "`" && source[index - 1] !== "\\") {
      return unescapeImportValue(source.slice(startIndex, index));
    }
  }

  return unescapeImportValue(source.slice(startIndex));
};

const parseArticleImport = (source: string): ArticleImportPayload | null => {
  if (!source.includes(":")) return null;

  const payload: ArticleImportPayload = {};

  articleImportFields.forEach((field) => {
    const value = extractQuotedImportField(source, field);
    if (value !== undefined) {
      payload[field] = value;
    }
  });

  const contentValue =
    extractTemplateImportField(source, "content") ??
    extractQuotedImportField(source, "content");

  if (contentValue !== undefined) {
    payload.content = contentValue;
  }

  const importedFieldCount = Object.keys(payload).length;
  if (importedFieldCount < 2 && payload.content === undefined) return null;

  return importedFieldCount > 0 ? payload : null;
};

const editorButtonClass =
  "inline-flex h-7 items-center justify-center gap-1 border border-white/10 px-2 text-[11px] font-medium text-zinc-300 hover:bg-white/5 hover:text-white";

const editorColorOptions = [
  { label: "سياسة", value: "#ef4444" },
  { label: "اقتصاد", value: "#38bdf8" },
  { label: "تكنولوجيا", value: "#818cf8" },
  { label: "ثقافة", value: "#22c55e" },
  { label: "Ryzen", value: "#f87171" },
  { label: "Intel", value: "#60a5fa" },
  { label: "أبيض", value: "#ffffff" },
  { label: "رمادي", value: "#a1a1aa" },
  { label: "أصفر", value: "#facc15" },
  { label: "برتقالي", value: "#fb923c" },
  { label: "أزرق", value: "#60a5fa" },
  { label: "وردي", value: "#f472b6" },
];

const normalizeArticleHtml = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  Array.from(template.content.children).forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    const shouldStayDiv =
      tagName !== "div" ||
      element.classList.contains("article-table-wrap") ||
      element.hasAttribute("data-image-slider") ||
      element.querySelector("table");

    if (shouldStayDiv) return;

    const paragraph = document.createElement("p");
    paragraph.innerHTML = element.innerHTML.trim() || "<br>";
    const textAlign = (element as HTMLElement).style.textAlign;

    if (["center", "justify", "left", "right"].includes(textAlign)) {
      paragraph.style.textAlign = textAlign;
    }

    element.replaceWith(paragraph);
  });

  return template.innerHTML;
};

export default function EditArticleForm({
  article,
  articles,
  hasDraft: initialHasDraft,
}: EditArticleFormProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const articlePickerRef = useRef<HTMLDivElement>(null);
  const htmlSourceRef = useRef<HTMLTextAreaElement>(null);
  const htmlDetailsRef = useRef<HTMLDetailsElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastEditorRangeRef = useRef<Range | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);
  const toolbarDragOffsetRef = useRef({ x: 0, y: 0 });
  const toolbarResizeStartRef = useRef({
    height: 0,
    pointerX: 0,
    pointerY: 0,
    width: 0,
  });
  const contentRef = useRef(article.content);
  const contentHistoryRef = useRef<string[]>([article.content]);
  const contentHistoryIndexRef = useRef(0);
  const isRestoringContentHistoryRef = useRef(false);
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [category, setCategory] = useState(article.category);
  const [author, setAuthor] = useState(article.author);
  const [date, setDate] = useState(article.date);
  const [image, setImage] = useState(article.image);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [description, setDescription] = useState(article.description);
  const [content, setContent] = useState(article.content);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [tableDesktopWidth, setTableDesktopWidth] =
    useState<TableDesktopWidth>("full");
  const [tableMobileMode, setTableMobileMode] =
    useState<TableMobileMode>("scroll");
  const [tableTextSize, setTableTextSize] = useState<TableTextSize>("sm");
  const [tableDesktopCustomWidth, setTableDesktopCustomWidth] = useState(900);
  const [tableMobileCustomWidth, setTableMobileCustomWidth] = useState(720);
  const [stickyFirstColumn, setStickyFirstColumn] = useState(true);
  const [selectedTableIndex, setSelectedTableIndex] = useState<number | null>(null);
  const [selectedTableCell, setSelectedTableCell] = useState<{
    cellIndex: number;
    rowIndex: number;
  } | null>(null);
  const [lastAction, setLastAction] = useState<SaveMode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [previewVersion, setPreviewVersion] = useState(() => Date.now());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("editor");
  const [searchResultLabel, setSearchResultLabel] = useState("");
  const [imageDeletePosition, setImageDeletePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editorBoxColor, setEditorBoxColor] = useState("#3b82f6");
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(() => {
    const firstArticle = articles.find((item) => item.slug !== article.slug);
    return firstArticle?.slug ?? "";
  });
  const [isArticlePickerOpen, setIsArticlePickerOpen] = useState(false);
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [editorToolbarPosition, setEditorToolbarPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 16, y: 16 };
    }

    const toolbarWidth = Math.min(620, window.innerWidth - 24);

    return {
      x: Math.max(12, window.innerWidth - toolbarWidth - 12),
      y: 12,
    };
  });
  const [isEditorToolbarDragging, setIsEditorToolbarDragging] = useState(false);
  const [editorToolbarSize, setEditorToolbarSize] = useState({
    height: 260,
    width: 620,
  });
  const [isEditorToolbarResizing, setIsEditorToolbarResizing] = useState(false);

  const prepareEditableTables = () => {
    editorRef.current?.querySelectorAll("td, th").forEach((cell) => {
      cell.setAttribute("contenteditable", "true");
    });
  };

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = contentRef.current;
    prepareEditableTables();
  }, [article.slug]);

  useEffect(() => {
    if (!isArticlePickerOpen) return;

    const closeArticlePicker = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;

      if (target && articlePickerRef.current?.contains(target)) return;

      setIsArticlePickerOpen(false);
      setArticleSearchQuery("");
    };

    document.addEventListener("pointerdown", closeArticlePicker);

    return () => {
      document.removeEventListener("pointerdown", closeArticlePicker);
    };
  }, [isArticlePickerOpen]);

  const categoryOptions = useMemo(
    () => Array.from(new Set([article.category, category, ...categories])),
    [article.category, category]
  );

  const linkableArticles = useMemo(
    () => articles.filter((item) => item.slug !== article.slug),
    [article.slug, articles]
  );

  const filteredLinkableArticles = useMemo(() => {
    const query = articleSearchQuery.trim().toLowerCase();
    if (!query) return linkableArticles;

    return linkableArticles.filter((item) =>
      [item.title, item.category, item.slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [articleSearchQuery, linkableArticles]);

  const selectedLinkableArticle = useMemo(
    () => linkableArticles.find((item) => item.slug === selectedArticleSlug),
    [linkableArticles, selectedArticleSlug]
  );

  const contentStats = useMemo(
    () => ({
      excerptLength: excerpt.trim().length,
      contentLength: content.replace(/<[^>]*>/g, "").trim().length,
      imageReady: image.trim().length > 0,
      tableCount: (content.match(/<table\b/gi) ?? []).length,
    }),
    [content, excerpt, image]
  );

  const applyContentSnapshot = (
    nextContent: string,
    focusTarget: "editor" | "html" = "editor"
  ) => {
    isRestoringContentHistoryRef.current = true;
    contentRef.current = nextContent;
    setContent(nextContent);

    if (editorRef.current) {
      editorRef.current.innerHTML = nextContent;
      prepareEditableTables();
    }

    window.requestAnimationFrame(() => {
      isRestoringContentHistoryRef.current = false;

      if (focusTarget === "html") {
        htmlSourceRef.current?.focus();
      } else {
        editorRef.current?.focus();
      }
    });
  };

  const pushContentHistory = (nextContent: string) => {
    if (isRestoringContentHistoryRef.current) return;

    const currentIndex = contentHistoryIndexRef.current;
    const currentHistory = contentHistoryRef.current;

    if (currentHistory[currentIndex] === nextContent) return;

    const nextHistory = currentHistory.slice(0, currentIndex + 1);
    nextHistory.push(nextContent);

    if (nextHistory.length > 120) {
      nextHistory.shift();
    } else {
      contentHistoryIndexRef.current += 1;
    }

    contentHistoryRef.current = nextHistory;
  };

  const isUndoShortcut = (
    event: KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => (event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "z" || event.code === "KeyZ");

  const isFindShortcut = (
    event: KeyboardEvent<HTMLDivElement | HTMLTextAreaElement | HTMLInputElement>
  ) => (event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "f" || event.code === "KeyF");

  const openEditorSearch = (target: SearchTarget) => {
    setSearchTarget(target);
    setIsSearchOpen(true);
    setSearchResultLabel("");

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  };

  const removeEditorSearchHighlights = (targetEditor = editorRef.current) => {
    targetEditor
      ?.querySelectorAll("mark[data-editor-search-match]")
      .forEach((mark) => {
        mark.replaceWith(...Array.from(mark.childNodes));
      });

    targetEditor?.normalize();
  };

  const getEditorTextNodes = () => {
    const editor = editorRef.current;
    if (!editor) return [];

    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      nodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    return nodes;
  };

  const getEditorSelectionTextOffset = (nodes: Text[]) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.startContainer)) return 0;

    let offset = 0;

    for (const node of nodes) {
      if (node === range.startContainer) {
        return offset + range.startOffset;
      }

      offset += node.data.length;
    }

    return offset;
  };

  const getTextPosition = (nodes: Text[], index: number) => {
    let offset = 0;

    for (const node of nodes) {
      const nextOffset = offset + node.data.length;
      if (index <= nextOffset) {
        return {
          node,
          offset: Math.max(0, Math.min(node.data.length, index - offset)),
        };
      }

      offset = nextOffset;
    }

    const fallbackNode = nodes.at(-1);
    return fallbackNode
      ? { node: fallbackNode, offset: fallbackNode.data.length }
      : null;
  };

  const findInEditor = (
    direction: "next" | "previous" = "next",
    nextQuery = searchQuery
  ) => {
    const query = nextQuery.trim();
    const editor = editorRef.current;
    if (!query || !editor) return;

    removeEditorSearchHighlights(editor);

    const nodes = getEditorTextNodes();
    const fullText = nodes.map((node) => node.data).join("");
    const normalizedText = fullText.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const currentOffset = getEditorSelectionTextOffset(nodes);
    const matches: number[] = [];
    let nextMatchIndex = normalizedText.indexOf(normalizedQuery);

    while (nextMatchIndex !== -1) {
      matches.push(nextMatchIndex);
      nextMatchIndex = normalizedText.indexOf(
        normalizedQuery,
        nextMatchIndex + normalizedQuery.length
      );
    }

    if (matches.length === 0) {
      setSearchResultLabel("لا توجد نتائج");
      return;
    }

    const selectedMatchIndex =
      direction === "next"
        ? matches.find((index) => index > currentOffset) ?? matches[0]
        : [...matches].reverse().find((index) => index < currentOffset) ??
          matches.at(-1) ??
          matches[0];

    const startPosition = getTextPosition(nodes, selectedMatchIndex);
    const endPosition = getTextPosition(nodes, selectedMatchIndex + query.length);
    if (!startPosition || !endPosition) return;

    const range = document.createRange();
    range.setStart(startPosition.node, startPosition.offset);
    range.setEnd(endPosition.node, endPosition.offset);

    const marker = document.createElement("mark");
    marker.setAttribute("data-editor-search-match", "true");
    marker.appendChild(range.extractContents());
    range.insertNode(marker);
    marker.scrollIntoView({ behavior: "smooth", block: "center" });

    const markerRange = document.createRange();
    markerRange.selectNodeContents(marker);
    lastEditorRangeRef.current = markerRange.cloneRange();

    const selectedResultNumber = matches.indexOf(selectedMatchIndex) + 1;
    setSearchResultLabel(`${selectedResultNumber} من ${matches.length}`);
  };

  const findInHtmlSource = (
    direction: "next" | "previous" = "next",
    nextQuery = searchQuery
  ) => {
    const query = nextQuery.trim();
    const textarea = htmlSourceRef.current;
    if (!query || !textarea) return;

    const source = textarea.value;
    const normalizedSource = source.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const matches: number[] = [];
    let nextMatchIndex = normalizedSource.indexOf(normalizedQuery);

    while (nextMatchIndex !== -1) {
      matches.push(nextMatchIndex);
      nextMatchIndex = normalizedSource.indexOf(
        normalizedQuery,
        nextMatchIndex + normalizedQuery.length
      );
    }

    if (matches.length === 0) {
      setSearchResultLabel("لا توجد نتائج");
      return;
    }

    const currentOffset =
      direction === "next" ? textarea.selectionEnd : textarea.selectionStart;

    const matchIndex =
      direction === "next"
        ? matches.find((index) => index >= currentOffset) ?? matches[0]
        : [...matches].reverse().find((index) => index < currentOffset) ??
          matches.at(-1) ??
          matches[0];

    htmlDetailsRef.current?.setAttribute("open", "true");
    textarea.focus();
    textarea.setSelectionRange(matchIndex, matchIndex + query.length);
    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    setSearchResultLabel(`${matches.indexOf(matchIndex) + 1} من ${matches.length}`);
  };

  const runEditorSearch = (
    direction: "next" | "previous" = "next",
    nextQuery = searchQuery
  ) => {
    if (searchTarget === "html") {
      findInHtmlSource(direction, nextQuery);
    } else {
      findInEditor(direction, nextQuery);
    }
  };

  const undoContentChange = (focusTarget: "editor" | "html" = "editor") => {
    const currentContent =
      focusTarget === "html"
        ? htmlSourceRef.current?.value ?? contentRef.current
        : getEditorHtml();

    if (contentHistoryRef.current[contentHistoryIndexRef.current] !== currentContent) {
      pushContentHistory(currentContent);
    }

    const currentIndex = contentHistoryIndexRef.current;

    if (currentIndex <= 0) return;

    const nextIndex = currentIndex - 1;
    contentHistoryIndexRef.current = nextIndex;
    applyContentSnapshot(contentHistoryRef.current[nextIndex], focusTarget);
  };

  const getEditorHtml = () => {
    const editor = editorRef.current;
    if (!editor) return contentRef.current;

    const clone = editor.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-selected-table]").forEach((element) => {
      element.removeAttribute("data-selected-table");
    });
    clone.querySelectorAll("mark[data-editor-search-match]").forEach((mark) => {
      mark.replaceWith(...Array.from(mark.childNodes));
    });
    clone.querySelectorAll("td[contenteditable], th[contenteditable]").forEach(
      (element) => {
        element.removeAttribute("contenteditable");
      }
    );

    return clone.innerHTML;
  };

  const syncContent = () => {
    const nextContent = getEditorHtml();
    contentRef.current = nextContent;
    pushContentHistory(nextContent);
  };

  const rememberEditorSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      lastEditorRangeRef.current = range.cloneRange();
    }
  };

  const restoreEditorSelection = () => {
    const editor = editorRef.current;
    const range = lastEditorRangeRef.current;
    const selection = window.getSelection();

    if (!editor || !range || !selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const moveEditorCaretToEnd = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();

    if (!editor || !selection) return;

    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    lastEditorRangeRef.current = range.cloneRange();
  };

  const syncContentState = () => {
    const nextContent = getEditorHtml();
    contentRef.current = nextContent;
    pushContentHistory(nextContent);
    setContent(nextContent);
  };

  const updateEditorHtml = (nextContent: string) => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = nextContent;
    prepareEditableTables();
  };

  const updateHtmlSource = (
    nextContent: string,
    options: { syncEditor?: boolean } = {}
  ) => {
    contentRef.current = nextContent;
    pushContentHistory(nextContent);
    setContent(nextContent);

    if (options.syncEditor ?? true) {
      updateEditorHtml(nextContent);
    }
  };

  const applyArticleImport = (payload: ArticleImportPayload) => {
    if (payload.title !== undefined) setTitle(payload.title);
    if (payload.slug !== undefined) setSlug(payload.slug);
    if (payload.category !== undefined) setCategory(payload.category);
    if (payload.author !== undefined) setAuthor(payload.author);
    if (payload.date !== undefined) setDate(payload.date);
    if (payload.image !== undefined) setImage(payload.image);
    if (payload.excerpt !== undefined) setExcerpt(payload.excerpt);
    if (payload.description !== undefined) setDescription(payload.description);

    if (payload.content !== undefined) {
      updateHtmlSource(payload.content);
    }

    setSavedAt(null);
    setLastAction(null);
    setSaveError(null);
    setPreviewVersion((version) => version + 1);
  };

  const handleArticleImportPaste = (event: ClipboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return false;

    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-skip-article-import]")) return false;

    const pastedText = event.clipboardData.getData("text/plain");
    if (!pastedText) return false;

    const importedArticle = parseArticleImport(pastedText);
    if (!importedArticle) return false;

    event.preventDefault();
    applyArticleImport(importedArticle);
    return true;
  };

  const startEditorToolbarDrag = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("button, input, select, textarea, a")) return;

    const toolbar = editorToolbarRef.current;
    if (!toolbar) return;

    const rect = toolbar.getBoundingClientRect();
    toolbarDragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setIsEditorToolbarDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragEditorToolbar = (event: PointerEvent<HTMLDivElement>) => {
    if (!isEditorToolbarDragging) return;

    const toolbar = editorToolbarRef.current;
    const width = toolbar?.offsetWidth ?? 720;
    const height = toolbar?.offsetHeight ?? 160;
    const margin = 8;

    setEditorToolbarPosition({
      x: Math.min(
        Math.max(margin, event.clientX - toolbarDragOffsetRef.current.x),
        Math.max(margin, window.innerWidth - width - margin)
      ),
      y: Math.min(
        Math.max(margin, event.clientY - toolbarDragOffsetRef.current.y),
        Math.max(margin, window.innerHeight - height - margin)
      ),
    });
  };

  const stopEditorToolbarDrag = (event: PointerEvent<HTMLDivElement>) => {
    setIsEditorToolbarDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const startEditorToolbarResize = (event: PointerEvent<HTMLButtonElement>) => {
    const toolbar = editorToolbarRef.current;
    if (!toolbar) return;

    toolbarResizeStartRef.current = {
      height: toolbar.offsetHeight,
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: toolbar.offsetWidth,
    };
    setIsEditorToolbarResizing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const resizeEditorToolbar = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isEditorToolbarResizing) return;

    const start = toolbarResizeStartRef.current;
    const maxWidth = Math.max(320, window.innerWidth - editorToolbarPosition.x - 8);
    const maxHeight = Math.max(180, window.innerHeight - editorToolbarPosition.y - 8);

    setEditorToolbarSize({
      height: Math.min(Math.max(170, start.height + event.clientY - start.pointerY), maxHeight),
      width: Math.min(Math.max(360, start.width + event.clientX - start.pointerX), maxWidth),
    });
  };

  const stopEditorToolbarResize = (event: PointerEvent<HTMLButtonElement>) => {
    setIsEditorToolbarResizing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getPayload = (): EditableArticlePayload => ({
    title,
    slug,
    category,
    author,
    date,
    image,
    excerpt,
    description,
    content: normalizeArticleHtml(getEditorHtml()),
    updatedAt: new Date().toLocaleTimeString("ar", { hour12: false }),
  });

  const saveArticle = async (mode: SaveMode) => {
    const payload = getPayload();

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/dashboard/articles/${slug || article.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          article: payload,
        }),
      });

      if (!response.ok) {
        throw new Error("تعذر حفظ المقال.");
      }

      setContent(payload.content);
      setSavedAt(payload.updatedAt);
      setLastAction(mode);
      setHasDraft(mode === "draft");
      setPreviewVersion((version) => version + 1);

      if (mode === "published") {
        router.push(
          `/news/${payload.slug}?published=${encodeURIComponent(payload.updatedAt)}`
        );
      }
    } catch {
      setSaveError("لم يتم الحفظ. تأكد أن خادم التطوير يعمل ثم جرّب مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    restoreEditorSelection();
    document.execCommand(command, false, value);
    rememberEditorSelection();
    syncContentState();
  };

  const applyTextColor = (color: string) => {
    runCommand("foreColor", color);
  };

  const insertHtml = (html: string) => {
    const editor = editorRef.current;
    const range = lastEditorRangeRef.current;

    editor?.focus();

    if (editor && range && editor.contains(range.commonAncestorContainer)) {
      restoreEditorSelection();
    } else {
      moveEditorCaretToEnd();
    }

    document.execCommand("insertHTML", false, html);
    prepareEditableTables();
    rememberEditorSelection();
    syncContentState();
  };

  const scrollToHtmlSource = () => {
    htmlDetailsRef.current?.setAttribute("open", "true");
    htmlSourceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => htmlSourceRef.current?.focus(), 250);
  };

  const scrollToEditorCaret = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();
    const range = lastEditorRangeRef.current;

    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
      const caretElement =
        range.startContainer.nodeType === Node.ELEMENT_NODE
          ? (range.startContainer as Element)
          : range.startContainer.parentElement;

      caretElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      editor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const getEditorTables = () =>
    Array.from(editorRef.current?.querySelectorAll("table") ?? []);

  const ensureTableWrapper = (table: HTMLTableElement) => {
    const currentParent = table.parentElement;

    if (currentParent?.classList.contains("article-table-wrap")) {
      return currentParent;
    }

    const wrapper = document.createElement("div");
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    return wrapper;
  };

  const getTableWrapper = (table: HTMLTableElement) => {
    const currentParent = table.parentElement;
    return currentParent?.classList.contains("article-table-wrap")
      ? currentParent
      : null;
  };

  const markSelectedTable = (index: number | null) => {
    const editor = editorRef.current;
    if (!editor) return;

    getEditorTables().forEach((table, tableIndex) => {
      const wrapper = table.parentElement?.classList.contains("article-table-wrap")
        ? table.parentElement
        : null;

      if (wrapper) {
        if (tableIndex === index) {
          wrapper.setAttribute("data-selected-table", "true");
        } else {
          wrapper.removeAttribute("data-selected-table");
        }
      }
    });
  };

  const loadTableSettings = (wrapper: HTMLElement) => {
    if (wrapper.classList.contains("article-table-desktop-narrow")) {
      setTableDesktopWidth("narrow");
    } else if (wrapper.classList.contains("article-table-desktop-wide")) {
      setTableDesktopWidth("wide");
    } else {
      setTableDesktopWidth("full");
    }

    setTableMobileMode(
      wrapper.classList.contains("article-table-mobile-stack") ? "stack" : "scroll"
    );
    setTableTextSize(wrapper.classList.contains("article-table-text-md") ? "md" : "sm");
    setStickyFirstColumn(wrapper.classList.contains("article-table-sticky-first"));

    const customWidth = wrapper.style.getPropertyValue("--article-table-width");
    const parsedWidth = Number(customWidth.replace("px", "").trim());
    if (Number.isFinite(parsedWidth) && parsedWidth > 0) {
      setTableDesktopCustomWidth(parsedWidth);
    }

    const mobileCustomWidth = wrapper.style.getPropertyValue(
      "--article-table-mobile-width"
    );
    const parsedMobileWidth = Number(mobileCustomWidth.replace("px", "").trim());
    if (Number.isFinite(parsedMobileWidth) && parsedMobileWidth > 0) {
      setTableMobileCustomWidth(parsedMobileWidth);
    }
  };

  const selectTable = (table: HTMLTableElement) => {
    const tables = getEditorTables();
    const nextIndex = tables.indexOf(table);
    const wrapper = getTableWrapper(table);

    setSelectedTableIndex(nextIndex);
    markSelectedTable(nextIndex);
    if (wrapper) {
      loadTableSettings(wrapper);
    }
  };

  const handleEditorClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const image = target.closest("img");

    rememberEditorSelection();

    if (image && editorRef.current?.contains(image)) {
      const rect = image.getBoundingClientRect();
      selectedImageRef.current = image as HTMLImageElement;
      setImageDeletePosition({
        x: Math.max(8, rect.left + 8),
        y: Math.max(8, rect.top + 8),
      });
      return;
    }

    selectedImageRef.current = null;
    setImageDeletePosition(null);

    const table = target.closest("table");

    if (!table) {
      setSelectedTableIndex(null);
      setSelectedTableCell(null);
      markSelectedTable(null);
      return;
    }

    selectTable(table as HTMLTableElement);

    const cell = target.closest("td, th") as HTMLTableCellElement | null;
    const row = cell?.closest("tr") as HTMLTableRowElement | null;

    if (cell && row) {
      setSelectedTableCell({
        cellIndex: cell.cellIndex,
        rowIndex: row.rowIndex,
      });
      window.requestAnimationFrame(rememberEditorSelection);
    }
  };

  const deleteSelectedImage = () => {
    const image = selectedImageRef.current;
    if (!image) return;

    const container = image.closest("figure") ?? image;
    const parent = container.parentNode;
    const range = document.createRange();

    if (parent) {
      range.setStartAfter(container);
      range.collapse(true);
      lastEditorRangeRef.current = range.cloneRange();
    }

    container.remove();
    selectedImageRef.current = null;
    setImageDeletePosition(null);
    syncContentState();
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isFindShortcut(event)) {
      event.preventDefault();
      openEditorSearch("editor");
      return;
    }

    if (isUndoShortcut(event)) {
      event.preventDefault();
      undoContentChange("editor");
      return;
    }

    if (event.key !== "Enter") return;

    event.preventDefault();

    if (event.shiftKey) {
      document.execCommand("insertLineBreak");
    } else {
      document.execCommand("insertParagraph");
    }

    syncContent();
  };

  const handleHtmlSourceKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (isFindShortcut(event)) {
      event.preventDefault();
      openEditorSearch("html");
      return;
    }

    if (isUndoShortcut(event)) {
      event.preventDefault();
      undoContentChange("html");
    }
  };

  const handleEditorPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (handleArticleImportPaste(event)) return;

    const pastedText = event.clipboardData.getData("text/plain");
    if (!pastedText) return;

    event.preventDefault();
    restoreEditorSelection();
    document.execCommand("insertText", false, pastedText);
    rememberEditorSelection();
    syncContentState();
  };

  const insertTable = () => {
    insertHtml(`
      <div class="article-table-wrap article-table-desktop-full article-table-mobile-scroll article-table-text-sm article-table-sticky-first" style="--article-table-width: 900px; --article-table-mobile-width: 720px;">
        <table>
          <thead>
            <tr>
              <th>العنصر</th>
              <th>القيمة الأولى</th>
              <th>القيمة الثانية</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>مثال</td>
              <td>100</td>
              <td>90</td>
            </tr>
            <tr>
              <td>مثال آخر</td>
              <td>75</td>
              <td>68</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>
    `);

    const tables = getEditorTables();
    const lastTable = tables.at(-1);
    if (lastTable) {
      selectTable(lastTable);
    }
  };

  const getSelectedArticle = () => selectedLinkableArticle;

  const insertRelatedArticle = () => {
    const relatedArticle = getSelectedArticle();
    if (!relatedArticle) return;

    insertHtml(`
      <aside class="article-related-link">
        <p>اقرأ أيضاً</p>
        <a href="/news/${relatedArticle.slug}">${relatedArticle.title}</a>
      </aside>
      <p><br></p>
    `);
  };

  const insertInlineNoteBox = () => {
    insertHtml(`
      <aside class="article-note-box" style="--article-box-color: ${editorBoxColor};">
        <p>اكتب نص المربع هنا.</p>
      </aside>
      <p><br></p>
    `);
  };

  const insertSummaryBox = () => {
    insertHtml(`
      <aside class="article-summary-box" style="--article-box-color: ${editorBoxColor};">
        <p><strong>باختصار:</strong> اكتب خلاصة الفقرة هنا.</p>
      </aside>
      <p><br></p>
    `);
  };

  const linkSelectionToArticle = () => {
    const relatedArticle = getSelectedArticle();
    if (!relatedArticle) return;

    editorRef.current?.focus();

    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode;
    const anchorElement =
      anchorNode?.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : anchorNode?.parentElement;
    const activeLink = anchorElement?.closest("a");

    if (activeLink && editorRef.current?.contains(activeLink)) {
      const textNode = document.createTextNode(activeLink.textContent ?? "");
      activeLink.replaceWith(textNode);
      syncContentState();
      return;
    }

    runCommand("createLink", `/news/${relatedArticle.slug}`);
  };

  const previewHref = hasDraft
    ? `/news/${slug || article.slug}?preview=draft&saved=${previewVersion}`
    : `/news/${slug || article.slug}`;

  const applyTableSettings = () => {
    if (selectedTableIndex === null) {
      return;
    }

    const selectedTable = getEditorTables()[selectedTableIndex];
    if (!selectedTable) {
      setSelectedTableIndex(null);
      markSelectedTable(null);
      return;
    }

    const wrapper = ensureTableWrapper(selectedTable);

    wrapper.className = [
      "article-table-wrap",
      `article-table-desktop-${tableDesktopWidth}`,
      "article-table-desktop-custom",
      `article-table-mobile-${tableMobileMode}`,
      `article-table-text-${tableTextSize}`,
      stickyFirstColumn ? "article-table-sticky-first" : "",
    ]
      .filter(Boolean)
      .join(" ");

    wrapper.setAttribute(
      "style",
      `--article-table-width: ${Math.max(
        280,
        tableDesktopCustomWidth
      )}px; --article-table-mobile-width: ${Math.max(
        280,
        tableMobileCustomWidth
      )}px;`
    );
    wrapper.setAttribute("data-selected-table", "true");

    syncContentState();
  };

  const getSelectedTable = () => {
    if (selectedTableIndex === null) return null;
    return getEditorTables()[selectedTableIndex] ?? null;
  };

  const deleteSelectedTableRow = () => {
    const selectedTable = getSelectedTable();
    if (!selectedTable || !selectedTableCell) return;

    const row = selectedTable.rows[selectedTableCell.rowIndex];
    if (!row) return;

    row.remove();

    if (selectedTable.rows.length === 0) {
      const wrapper = selectedTable.closest(".article-table-wrap") ?? selectedTable;
      wrapper.remove();
      setSelectedTableIndex(null);
    }

    setSelectedTableCell(null);
    syncContentState();
  };

  const deleteSelectedTableColumn = () => {
    const selectedTable = getSelectedTable();
    if (!selectedTable || !selectedTableCell) return;

    const columnIndex = selectedTableCell.cellIndex;

    Array.from(selectedTable.rows).forEach((row) => {
      row.cells[columnIndex]?.remove();
    });

    const hasCells = Array.from(selectedTable.rows).some(
      (row) => row.cells.length > 0
    );

    if (!hasCells) {
      const wrapper = selectedTable.closest(".article-table-wrap") ?? selectedTable;
      wrapper.remove();
      setSelectedTableIndex(null);
    }

    setSelectedTableCell(null);
    syncContentState();
  };

  return (
    <form
      className="grid min-w-0 gap-6 pb-28 xl:grid-cols-[minmax(0,1fr)_360px]"
      onPaste={handleArticleImportPaste}
      onSubmit={(event) => {
        event.preventDefault();
        void saveArticle("draft");
      }}
    >
      <div className="fixed inset-x-4 bottom-4 z-50 grid gap-2 sm:inset-x-auto sm:left-4 sm:w-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-10 items-center justify-center gap-2 border border-white/10 bg-[#101012] px-3 text-xs font-black text-white shadow-2xl hover:bg-white/10"
            onMouseDown={(event) => event.preventDefault()}
            onClick={scrollToHtmlSource}
            type="button"
          >
            <Code2 size={16} />
            <span>HTML</span>
          </button>
          <button
            className="flex h-10 items-center justify-center gap-2 border border-white/10 bg-[#101012] px-3 text-xs font-black text-white shadow-2xl hover:bg-white/10"
            onMouseDown={(event) => event.preventDefault()}
            onClick={scrollToEditorCaret}
            type="button"
          >
            <WrapText size={16} />
            <span>المؤشر</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-12 items-center justify-center gap-2 border border-white/10 bg-[#101012] px-4 text-sm font-black text-white shadow-2xl hover:bg-white/10"
            disabled={isSaving}
            onClick={() => void saveArticle("draft")}
            type="button"
          >
            <Save size={18} />
            <span>{isSaving ? "جارٍ..." : "حفظ"}</span>
          </button>
          <button
            className="flex h-12 items-center justify-center gap-2 bg-red-600 px-4 text-sm font-black text-white shadow-2xl hover:bg-red-500"
            disabled={isSaving}
            onClick={() => void saveArticle("published")}
            type="button"
          >
            <Send size={18} />
            <span>نشر</span>
          </button>
        </div>
      </div>

      {imageDeletePosition ? (
        <button
          className="fixed z-[70] flex h-8 w-8 items-center justify-center border border-red-400/50 bg-red-600 text-white shadow-2xl hover:bg-red-500"
          onMouseDown={(event) => event.preventDefault()}
          onClick={deleteSelectedImage}
          style={{
            left: imageDeletePosition.x,
            top: imageDeletePosition.y,
          }}
          title="حذف الصورة"
          type="button"
        >
          <X size={17} />
        </button>
      ) : null}

      {isSearchOpen ? (
        <div className="fixed left-4 top-4 z-[80] w-[min(420px,calc(100vw-32px))] border border-white/10 bg-[#101012] p-2 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2">
            <Search className="shrink-0 text-zinc-400" size={16} />
            <input
              ref={searchInputRef}
              className="h-9 min-w-0 flex-1 border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-red-500/60"
              dir="auto"
              onChange={(event) => {
                const nextQuery = event.target.value;
                setSearchQuery(nextQuery);
                setSearchResultLabel("");
                window.requestAnimationFrame(() => {
                  runEditorSearch("next", nextQuery);
                });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runEditorSearch(event.shiftKey ? "previous" : "next");
                }

                if (event.key === "Escape") {
                  setIsSearchOpen(false);
                  removeEditorSearchHighlights();
                }
              }}
              placeholder={
                searchTarget === "html"
                  ? "بحث داخل HTML"
                  : "بحث داخل المحرر"
              }
              value={searchQuery}
            />
            <button
              className="h-9 border border-white/10 px-3 text-xs font-bold text-zinc-200 hover:bg-white/10"
              onClick={() => runEditorSearch("previous")}
              type="button"
            >
              السابق
            </button>
            <button
              className="h-9 bg-white px-3 text-xs font-bold text-black hover:bg-zinc-200"
              onClick={() => runEditorSearch("next")}
              type="button"
            >
              التالي
            </button>
            <button
              aria-label="إغلاق البحث"
              className="flex h-9 w-9 items-center justify-center border border-white/10 text-zinc-300 hover:bg-white/10"
              onClick={() => {
                setIsSearchOpen(false);
                removeEditorSearchHighlights();
              }}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span>{searchTarget === "html" ? "HTML" : "المحرر العادي"}</span>
            <span>{searchResultLabel || "Enter للنتيجة التالية"}</span>
          </div>
        </div>
      ) : null}

      <section className="min-w-0 space-y-5">
        <div className="border border-white/10 bg-[#101012] p-5">
          <div className="mb-5 flex items-center gap-3">
            <Type className="text-red-300" size={22} />
            <h2 className="text-xl font-black">بيانات المقال</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-bold text-zinc-400">العنوان</span>
              <input
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm font-bold text-white outline-none focus:border-red-500/60"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label>
              <span className="text-sm font-bold text-zinc-400">الرابط</span>
              <input
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-red-500/60"
                dir="ltr"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </label>

            <label>
              <span className="text-sm font-bold text-zinc-400">التصنيف</span>
              <select
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-red-500/60"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-bold text-zinc-400">الكاتب</span>
              <input
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-red-500/60"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
              />
            </label>

            <label>
              <span className="text-sm font-bold text-zinc-400">التاريخ</span>
              <input
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-red-500/60"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-bold text-zinc-400">الصورة</span>
              <input
                className="mt-2 h-12 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-red-500/60"
                dir="ltr"
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="border border-white/10 bg-[#101012] p-5">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="text-sky-300" size={22} />
            <h2 className="text-xl font-black">النصوص</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-zinc-400">المقتطف</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y border border-white/10 bg-black/30 p-3 text-sm leading-7 text-white outline-none focus:border-red-500/60"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-400">وصف SEO</span>
              <textarea
                className="mt-2 min-h-24 w-full resize-y border border-white/10 bg-black/30 p-3 text-sm leading-7 text-white outline-none focus:border-red-500/60"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="border border-white/10 bg-[#101012] p-5">
          <div
            ref={editorToolbarRef}
            className={`fixed z-50 overflow-y-auto border border-white/10 bg-[#101012]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur ${
              isEditorToolbarDragging || isEditorToolbarResizing
                ? "select-none"
                : ""
            }`}
            style={{
              height: editorToolbarSize.height,
              left: editorToolbarPosition.x,
              top: editorToolbarPosition.y,
              width: `min(${editorToolbarSize.width}px, calc(100vw - 16px))`,
            }}
          >
          <div
            className="mb-1.5 flex cursor-grab flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between"
            onPointerDown={startEditorToolbarDrag}
            onPointerMove={dragEditorToolbar}
            onPointerUp={stopEditorToolbarDrag}
            onPointerCancel={stopEditorToolbarDrag}
          >
            <div className="flex items-center gap-2">
              <WrapText className="text-emerald-300" size={15} />
              <div>
                <h2 className="text-sm font-semibold">محرر المحتوى</h2>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <button
                className={`${editorButtonClass} ${
                  previewDevice === "desktop" ? "bg-white/10 text-white" : ""
                }`}
                onClick={() => setPreviewDevice("desktop")}
                type="button"
              >
                <Monitor size={17} />
                <span>ديسكتوب</span>
              </button>
              <button
                className={`${editorButtonClass} ${
                  previewDevice === "mobile" ? "bg-white/10 text-white" : ""
                }`}
                onClick={() => setPreviewDevice("mobile")}
                type="button"
              >
                <Smartphone size={17} />
                <span>موبايل</span>
              </button>
            </div>
            <button
              aria-label="تغيير حجم لوحة المحرر"
              className="absolute bottom-1 left-1 h-4 w-4 cursor-nwse-resize border-b-2 border-l-2 border-zinc-500/80"
              onPointerDown={startEditorToolbarResize}
              onPointerMove={resizeEditorToolbar}
              onPointerUp={stopEditorToolbarResize}
              onPointerCancel={stopEditorToolbarResize}
              type="button"
            />
          </div>

          <div className="mb-1.5 flex flex-wrap gap-1">
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("formatBlock", "h2")}
              type="button"
            >
              <Heading2 size={17} />
              <span>عنوان</span>
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("formatBlock", "h3")}
              type="button"
            >
              <Heading3 size={17} />
              <span>فرعي</span>
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("bold")}
              type="button"
            >
              <Bold size={17} />
              <span>غامق</span>
            </button>
            <button
              aria-label="محاذاة إلى اليمين"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("italic")}
              title="نص مائل"
              type="button"
            >
              <Italic size={17} />
            </button>
            <button
              aria-label="خط تحت النص"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("underline")}
              title="خط تحت النص"
              type="button"
            >
              <Underline size={17} />
            </button>
            <button
              aria-label="محاذاة إلى اليمين"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("justifyRight")}
              title="محاذاة إلى اليمين"
              type="button"
            >
              <AlignRight size={17} />
            </button>
            <button
              aria-label="محاذاة إلى الوسط"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("justifyCenter")}
              title="محاذاة إلى الوسط"
              type="button"
            >
              <AlignCenter size={17} />
            </button>
            <button
              aria-label="محاذاة إلى اليسار"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("justifyLeft")}
              title="محاذاة إلى اليسار"
              type="button"
            >
              <AlignLeft size={17} />
            </button>
            <button
              aria-label="ضبط النص"
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("justifyFull")}
              title="ضبط النص"
              type="button"
            >
              <AlignJustify size={17} />
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("insertUnorderedList")}
              type="button"
            >
              <List size={17} />
              <span>قائمة</span>
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                insertHtml(
                  '<blockquote><p>اكتب الاقتباس أو الملاحظة هنا.</p></blockquote><p><br></p>'
                )
              }
              type="button"
            >
              <Quote size={17} />
              <span>اقتباس</span>
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertTable}
              type="button"
            >
              <Table2 size={17} />
              <span>جدول</span>
            </button>
            <button
              className={editorButtonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={scrollToEditorCaret}
              type="button"
            >
              <WrapText size={17} />
              <span>المؤشر</span>
            </button>
          </div>

          <div className="mb-1.5 flex flex-wrap items-center gap-1 border border-white/10 bg-black/20 p-1">
            <div className="flex h-6 items-center gap-1 px-1 text-[11px] font-normal text-zinc-400">
              <Palette size={13} />
              <span>لون</span>
            </div>
            {editorColorOptions.map((color) => (
              <button
                key={color.value}
                className="flex h-6 items-center gap-1 border border-white/10 bg-black/30 px-1.5 text-[10px] font-normal text-zinc-300 hover:bg-white/10"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyTextColor(color.value)}
                title={color.label}
                type="button"
              >
                <span
                  className="h-3 w-3 border border-white/20"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-1.5 flex flex-nowrap items-end gap-1.5 overflow-x-auto border border-white/10 bg-black/20 p-1.5 text-xs">
            <label className="w-24 shrink-0">
              <span className="text-[11px] font-normal text-zinc-500">لون المربع</span>
              <input
                className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 p-1"
                type="color"
                value={editorBoxColor}
                onChange={(event) => setEditorBoxColor(event.target.value)}
              />
            </label>

            {editorColorOptions.slice(0, 4).map((color) => (
              <button
                key={`box-${color.value}`}
                className="flex h-7 shrink-0 items-center gap-1 border border-white/10 bg-black/30 px-1.5 text-[10px] font-normal text-zinc-300 hover:bg-white/10"
                onClick={() => setEditorBoxColor(color.value)}
                type="button"
              >
                <span
                  className="h-3 w-3 border border-white/20"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.label}</span>
              </button>
            ))}

            <button
              className="flex h-7 shrink-0 items-center justify-center gap-1.5 border border-white/10 bg-black/30 px-2.5 text-xs font-normal text-zinc-200 hover:bg-white/10"
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertInlineNoteBox}
              type="button"
            >
              <FileText size={14} />
              <span>مربع جانبي</span>
            </button>

            <button
              className="flex h-7 shrink-0 items-center justify-center gap-1.5 border border-white/10 bg-black/30 px-2.5 text-xs font-normal text-zinc-200 hover:bg-white/10"
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertSummaryBox}
              type="button"
            >
              <FileText size={14} />
              <span>باختصار</span>
            </button>
          </div>

          <div className="mb-1.5 flex flex-nowrap items-start gap-1.5 overflow-x-auto border border-white/10 bg-black/20 p-1.5 text-xs">
            <div ref={articlePickerRef} className="w-80 shrink-0">
              <span className="text-[11px] font-normal text-zinc-500">
                مقال للربط
              </span>
              <button
                className="mt-0.5 flex h-8 w-full min-w-0 items-center justify-between gap-2 border border-white/10 bg-black/40 px-2 text-right text-xs font-normal text-white outline-none hover:bg-white/5"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setIsArticlePickerOpen((isOpen) => !isOpen)}
                type="button"
              >
                <span className="min-w-0 truncate">
                  {selectedLinkableArticle?.title ?? "اختر مقالًا للربط"}
                </span>
                <ChevronDown
                  className={`shrink-0 text-zinc-400 transition-transform ${
                    isArticlePickerOpen ? "rotate-180" : ""
                  }`}
                  size={15}
                />
              </button>

              {isArticlePickerOpen ? (
                <div
                  className="mt-1 w-full border border-white/10 bg-[#101012] p-2 shadow-2xl"
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <label className="flex h-8 items-center gap-2 border border-white/10 bg-black/40 px-2">
                    <Search className="shrink-0 text-zinc-500" size={14} />
                    <input
                      className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                      onChange={(event) => setArticleSearchQuery(event.target.value)}
                      placeholder="ابحث عن مقال"
                      value={articleSearchQuery}
                    />
                  </label>

                  <div className="mt-2 max-h-44 overflow-y-auto border border-white/10">
                    {filteredLinkableArticles.length > 0 ? (
                      filteredLinkableArticles.map((item) => (
                        <button
                          key={item.slug}
                          className={`block w-full border-b border-white/10 px-3 py-2 text-right text-xs leading-5 hover:bg-white/10 ${
                            item.slug === selectedArticleSlug
                              ? "bg-white/10 text-white"
                              : "text-zinc-300"
                          }`}
                          onClick={() => {
                            setSelectedArticleSlug(item.slug);
                            setIsArticlePickerOpen(false);
                            setArticleSearchQuery("");
                            window.requestAnimationFrame(restoreEditorSelection);
                          }}
                          type="button"
                        >
                          <span className="block truncate font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                            {item.category} / {item.slug}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-zinc-500">
                        لا توجد مقالات مطابقة
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <label className="hidden min-w-64 shrink-0">
              <span className="text-[11px] font-normal text-zinc-500">
                مقال للربط
              </span>
              <select
                className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                value={selectedArticleSlug}
                onChange={(event) => setSelectedArticleSlug(event.target.value)}
              >
                {linkableArticles.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="flex h-7 shrink-0 items-center justify-center gap-1.5 border border-white/10 bg-black/30 px-2.5 text-xs font-normal text-zinc-200 hover:bg-white/10"
              disabled={!selectedArticleSlug}
              onMouseDown={(event) => event.preventDefault()}
              onClick={linkSelectionToArticle}
              type="button"
            >
              <Link2 size={14} />
              <span>ربط النص</span>
            </button>

            <button
              className="flex h-7 shrink-0 items-center justify-center gap-1.5 bg-white px-2.5 text-xs font-semibold text-black hover:bg-zinc-200"
              disabled={!selectedArticleSlug}
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertRelatedArticle}
              type="button"
            >
              <FileText size={14} />
              <span>اقرأ أيضاً</span>
            </button>
          </div>

            <div className="mt-2 flex flex-nowrap items-end gap-1.5 overflow-x-auto border border-white/10 bg-black/20 p-1.5 text-xs">
              <label className="w-24 shrink-0">
                <span className="text-[11px] font-normal text-zinc-500">الديسكتوب</span>
                <select
                  className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                  value={tableDesktopWidth}
                  onChange={(event) =>
                    setTableDesktopWidth(event.target.value as TableDesktopWidth)
                  }
                >
                  <option value="full">كامل</option>
                  <option value="wide">واسع</option>
                  <option value="narrow">ضيق</option>
                </select>
              </label>

              <label className="w-28 shrink-0">
                <span className="text-[11px] font-normal text-zinc-500">الموبايل</span>
                <select
                  className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                  value={tableMobileMode}
                  onChange={(event) =>
                    setTableMobileMode(event.target.value as TableMobileMode)
                  }
                >
                  <option value="scroll">تمرير أفقي</option>
                  <option value="stack">بطاقات</option>
                </select>
              </label>

              <label className="w-24 shrink-0">
                <span className="text-[11px] font-normal text-zinc-500">حجم النص</span>
                <select
                  className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                  value={tableTextSize}
                  onChange={(event) =>
                    setTableTextSize(event.target.value as TableTextSize)
                  }
                >
                  <option value="sm">مضغوط</option>
                  <option value="md">مريح</option>
                </select>
              </label>

              <label className="w-24 shrink-0">
                <span className="text-[11px] font-normal text-zinc-500">عرض الديسكتوب</span>
                <input
                  className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                  min={280}
                  max={1400}
                  step={10}
                  type="number"
                  value={tableDesktopCustomWidth}
                  onChange={(event) =>
                    setTableDesktopCustomWidth(Number(event.target.value) || 900)
                  }
                />
              </label>

              <label className="w-24 shrink-0">
                <span className="text-[11px] font-normal text-zinc-500">عرض الموبايل</span>
                <input
                  className="mt-0.5 h-7 w-full border border-white/10 bg-black/40 px-2 text-xs font-normal text-white outline-none"
                  min={280}
                  max={1400}
                  step={10}
                  type="number"
                  value={tableMobileCustomWidth}
                  onChange={(event) =>
                    setTableMobileCustomWidth(Number(event.target.value) || 720)
                  }
                />
              </label>

              <div className="flex shrink-0 items-end gap-1.5">
                <label className="flex h-7 w-24 items-center justify-between gap-2 border border-white/10 bg-black/30 px-2 text-xs font-normal text-zinc-300">
                  <span>تثبيت العمود</span>
                  <input
                    checked={stickyFirstColumn}
                    className="h-3.5 w-3.5 accent-red-600"
                    onChange={(event) => setStickyFirstColumn(event.target.checked)}
                    type="checkbox"
                  />
                </label>
                <button
                  className="flex h-7 items-center justify-center gap-1.5 bg-white px-2.5 text-xs font-semibold text-black hover:bg-zinc-200"
                  onClick={applyTableSettings}
                  type="button"
                >
                  <Table2 size={15} />
                  <span>تطبيق</span>
                </button>
                <button
                  className="flex h-7 items-center justify-center border border-red-500/40 bg-red-500/10 px-2 text-xs font-normal text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!selectedTableCell}
                  onClick={deleteSelectedTableRow}
                  type="button"
                >
                  حذف صف
                </button>
                <button
                  className="flex h-7 items-center justify-center border border-red-500/40 bg-red-500/10 px-2 text-xs font-normal text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!selectedTableCell}
                  onClick={deleteSelectedTableColumn}
                  type="button"
                >
                  حذف عمود
                </button>
              </div>
            </div>
          </div>

          <div className="h-[205px] md:h-[128px] xl:h-[100px]" />

          <div
            className={`mx-auto w-full min-w-0 overflow-hidden transition-all ${
              previewDevice === "mobile" ? "max-w-[390px]" : "max-w-full"
            }`}
          >
            <div
              ref={editorRef}
              className="article-editor article-content prose prose-invert w-full min-w-0 max-w-full border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-red-500/60 md:p-6"
              contentEditable
              dir="rtl"
              onBlur={syncContentState}
              onClick={handleEditorClick}
              onInput={() => {
                rememberEditorSelection();
                syncContent();
              }}
              onKeyDown={handleEditorKeyDown}
              onKeyUp={rememberEditorSelection}
              onMouseUp={rememberEditorSelection}
              onPaste={handleEditorPaste}
              role="textbox"
              suppressContentEditableWarning
            />
          </div>

          <details
            ref={htmlDetailsRef}
            className="mt-4 border border-white/10 bg-black/20 p-4"
          >
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-bold text-zinc-300">
              <Code2 size={17} />
              HTML الناتج للربط لاحقاً
            </summary>
            <textarea
              ref={htmlSourceRef}
              className="mt-4 min-h-48 w-full border border-white/10 bg-black/40 p-3 font-mono text-xs leading-6 text-zinc-300 outline-none"
              dir="ltr"
              onBlur={() => updateEditorHtml(contentRef.current)}
              onChange={(event) =>
                updateHtmlSource(event.target.value, { syncEditor: false })
              }
              onKeyDown={handleHtmlSourceKeyDown}
              value={content}
            />
          </details>
        </div>
      </section>

      <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:h-fit">
        <section className="border border-white/10 bg-[#101012] p-5">
          <h2 className="text-xl font-black">النشر</h2>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="border border-white/10 bg-black/20 p-3">
              <p className="text-zinc-500">المقتطف</p>
              <p className="mt-2 font-black">{contentStats.excerptLength}</p>
            </div>
            <div className="border border-white/10 bg-black/20 p-3">
              <p className="text-zinc-500">المحتوى</p>
              <p className="mt-2 font-black">{contentStats.contentLength}</p>
            </div>
          </div>

          {savedAt ? (
            <div className="mt-4 flex items-start gap-3 border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm leading-7 text-emerald-200">
              <CheckCircle2 className="mt-1 shrink-0" size={18} />
              <div>
                <p>
                  {lastAction === "published"
                    ? "تم نشر النسخة الحالية"
                    : "تم حفظ المسودة"}{" "}
                  عند {savedAt}.
                </p>
                {lastAction === "draft" ? (
                  <Link
                    className="mt-2 inline-flex font-black text-white underline"
                    href={previewHref}
                  >
                    فتح معاينة المسودة
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          {saveError ? (
            <div className="mt-4 border border-red-500/40 bg-red-500/10 p-3 text-sm leading-7 text-red-200">
              {saveError}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            <button
              className="flex h-11 items-center justify-center gap-2 bg-red-600 px-4 text-sm font-black text-white hover:bg-red-500"
              disabled={isSaving}
              type="submit"
            >
              <Save size={18} />
              <span>{isSaving ? "جارٍ الحفظ..." : "حفظ كمسودة"}</span>
            </button>

            <button
              className="flex h-11 items-center justify-center gap-2 bg-white px-4 text-sm font-black text-black hover:bg-zinc-200"
              disabled={isSaving}
              onClick={() => void saveArticle("published")}
              type="button"
            >
              <Send size={18} />
              <span>نشر المقال</span>
            </button>

            <Link
              href={previewHref}
              className="flex h-11 items-center justify-center gap-2 border border-white/10 text-sm font-black hover:bg-white/5"
            >
              <Eye size={18} />
              <span>{hasDraft ? "معاينة المسودة" : "معاينة المقال"}</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex h-11 items-center justify-center border border-white/10 text-sm font-black text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              الرجوع للوحة التحكم
            </Link>
          </div>
        </section>

        <section className="hidden border border-white/10 bg-[#101012] p-5">
          <div className="flex items-center gap-3">
            <Columns3 className="text-sky-300" size={22} />
            <h2 className="text-xl font-black">عرض الجداول</h2>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-zinc-400">
                العرض على الديسكتوب
              </span>
              <select
                className="mt-2 h-11 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                value={tableDesktopWidth}
                onChange={(event) =>
                  setTableDesktopWidth(event.target.value as TableDesktopWidth)
                }
              >
                <option value="full">كامل عرض المقال</option>
                <option value="wide">واسع ومنظم</option>
                <option value="narrow">ضيق للمقارنات الصغيرة</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-400">
                العرض على الموبايل
              </span>
              <select
                className="mt-2 h-11 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                value={tableMobileMode}
                onChange={(event) =>
                  setTableMobileMode(event.target.value as TableMobileMode)
                }
              >
                <option value="scroll">تمرير أفقي</option>
                <option value="stack">تحويل الصفوف لبطاقات</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-400">حجم النص</span>
              <select
                className="mt-2 h-11 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                value={tableTextSize}
                onChange={(event) =>
                  setTableTextSize(event.target.value as TableTextSize)
                }
              >
                <option value="sm">مضغوط</option>
                <option value="md">مريح</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-400">
                عرض مخصص بالبكسل
              </span>
              <input
                className="mt-2 h-11 w-full border border-white/10 bg-black/30 px-3 text-sm text-white outline-none"
                min={280}
                max={1400}
                step={10}
                type="number"
                value={tableDesktopCustomWidth}
                onChange={(event) =>
                  setTableDesktopCustomWidth(Number(event.target.value) || 900)
                }
              />
            </label>

            <label className="flex items-center justify-between gap-4 border border-white/10 bg-black/20 p-3 text-sm font-bold text-zinc-300">
              <span>تثبيت أول عمود</span>
              <input
                checked={stickyFirstColumn}
                className="h-5 w-5 accent-red-600"
                onChange={(event) => setStickyFirstColumn(event.target.checked)}
                type="checkbox"
              />
            </label>

            <button
              className="flex h-11 w-full items-center justify-center gap-2 bg-white px-4 text-sm font-black text-black hover:bg-zinc-200"
              onClick={applyTableSettings}
              type="button"
            >
              <Table2 size={18} />
              <span>تطبيق على جداول المقال</span>
            </button>

            <p className="text-sm leading-7 text-zinc-500">
              عدد الجداول الحالية: {contentStats.tableCount}. الإعدادات تضيف
              تغليفاً منظماً للجداول حتى تظهر أفضل على الموبايل والديسكتوب.
            </p>
          </div>
        </section>

        <section className="border border-white/10 bg-[#101012] p-5">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-indigo-300" size={22} />
            <h2 className="text-xl font-black">الصورة</h2>
          </div>

          <div className="mt-5 overflow-hidden border border-white/10 bg-black/30">
            {contentStats.imageReady ? (
              <Image
                alt={title}
                className="aspect-video w-full object-cover"
                height={360}
                src={image}
                unoptimized
                width={640}
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm text-zinc-500">
                لا توجد صورة
              </div>
            )}
          </div>
        </section>
      </aside>
    </form>
  );
}
