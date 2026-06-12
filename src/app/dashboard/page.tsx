import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Eye,
  FilePenLine,
  FileText,
  FolderKanban,
  Gauge,
  ImageIcon,
  LayoutDashboard,
  Newspaper,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

import { news } from "@/data/news";

export const metadata: Metadata = {
  title: "لوحة التحكم | Maalam.net",
  description: "لوحة تحكم تحريرية لإدارة محتوى Maalam.net.",
};

const categoryStyles: Record<string, { text: string; border: string; bg: string }> = {
  سياسة: {
    text: "text-red-300",
    border: "border-red-500/35",
    bg: "bg-red-500/10",
  },
  اقتصاد: {
    text: "text-sky-300",
    border: "border-sky-400/35",
    bg: "bg-sky-400/10",
  },
  تكنولوجيا: {
    text: "text-indigo-300",
    border: "border-indigo-400/35",
    bg: "bg-indigo-400/10",
  },
  ثقافة: {
    text: "text-emerald-300",
    border: "border-emerald-400/35",
    bg: "bg-emerald-400/10",
  },
};

const navItems = [
  { label: "الرئيسية", icon: LayoutDashboard, active: true },
  { label: "المقالات", icon: Newspaper },
  { label: "التصنيفات", icon: FolderKanban },
  { label: "الوسائط", icon: ImageIcon },
  { label: "الكتّاب", icon: Users },
  { label: "الإعدادات", icon: Settings },
];

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const categoryCounts = news.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + 1;
  return acc;
}, {});

const recentNews = news.slice(0, 7);
const featuredNews = news[0];
const averageExcerptLength = Math.round(
  news.reduce((total, item) => total + stripHtml(item.excerpt).length, 0) /
    Math.max(news.length, 1)
);

const stats = [
  {
    label: "كل المقالات",
    value: news.length.toString(),
    change: "منشورة",
    icon: FileText,
    accent: "text-red-300",
  },
  {
    label: "التصنيفات",
    value: Object.keys(categoryCounts).length.toString(),
    change: "نشطة",
    icon: FolderKanban,
    accent: "text-sky-300",
  },
  {
    label: "متوسط المقتطف",
    value: averageExcerptLength.toString(),
    change: "حرف",
    icon: BarChart3,
    accent: "text-indigo-300",
  },
  {
    label: "جاهزية النشر",
    value: "100%",
    change: "بدون مسودات",
    icon: Gauge,
    accent: "text-emerald-300",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[clamp(220px,18vw,280px)_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#0d0d0f] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-l">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-4 py-4 sm:px-5 sm:py-5">
              <Link href="/" className="block text-2xl font-black">
                Maalam.net
              </Link>
              <p className="mt-1 text-sm text-zinc-500">لوحة التحرير</p>
            </div>

            <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    className={`flex min-w-fit items-center gap-3 border px-3 py-3 text-sm font-bold transition-colors sm:px-4 ${
                      item.active
                        ? "border-red-500/40 bg-red-500/10 text-white"
                        : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto hidden border-t border-white/10 p-5 lg:block">
              <div className="border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-red-300" size={20} />
                  <span className="text-sm font-bold">مركز التحرير</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  متابعة سريعة لحالة المحتوى، التصنيفات، وجودة المقالات.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080808]/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-300">Maalam CMS</p>
                <h1 className="mt-1 text-2xl font-black md:text-3xl">
                  لوحة التحكم
                </h1>
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex h-11 min-w-0 items-center gap-3 border border-white/10 bg-white/[0.03] px-3 sm:w-72 md:w-80">
                  <Search size={18} className="shrink-0 text-zinc-500" />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                    placeholder="بحث في المقالات"
                    type="search"
                  />
                </label>

                <button
                  className="flex h-11 items-center justify-center gap-2 bg-red-600 px-4 text-sm font-black text-white transition-colors hover:bg-red-500"
                  type="button"
                >
                  <Plus size={18} />
                  <span>مقال جديد</span>
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-6 px-4 py-6 md:px-8">
            <section className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="border border-white/10 bg-[#101012] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                        <p className="mt-3 text-3xl font-black">{stat.value}</p>
                      </div>
                      <Icon className={stat.accent} size={24} />
                    </div>
                    <p className="mt-4 text-sm font-bold text-zinc-400">
                      {stat.change}
                    </p>
                  </article>
                );
              })}
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.65fr)]">
              <div className="min-w-0 border border-white/10 bg-[#101012]">
                <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-black">المقالات الأخيرة</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {recentNews.length} عناصر في قائمة التحرير
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/5"
                      type="button"
                    >
                      منشور
                    </button>
                    <button
                      className="border border-white/10 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/5"
                      type="button"
                    >
                      الأحدث
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 p-4 lg:hidden">
                  {recentNews.map((item) => {
                    const categoryStyle =
                      categoryStyles[item.category] ?? {
                        text: "text-zinc-300",
                        border: "border-white/10",
                        bg: "bg-white/5",
                      };

                    return (
                      <article
                        key={item.slug}
                        className="border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-black leading-7 text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 truncate text-xs text-zinc-500">
                              /news/{item.slug}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 border px-2 py-1 text-xs font-bold ${categoryStyle.border} ${categoryStyle.bg} ${categoryStyle.text}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                          <span>{item.author}</span>
                          <span className="text-left">{item.date}</span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/news/${item.slug}`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 border border-white/10 text-sm font-bold hover:bg-white/5"
                          >
                            <Eye size={16} />
                            <span>عرض</span>
                          </Link>
                          <Link
                            href={`/dashboard/news/${item.slug}/edit`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 bg-white text-sm font-black text-black hover:bg-zinc-200"
                          >
                            <FilePenLine size={16} />
                            <span>تحرير</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[760px] border-collapse text-right">
                    <thead className="bg-white/[0.03] text-xs text-zinc-500">
                      <tr>
                        <th className="px-5 py-3 font-bold">العنوان</th>
                        <th className="px-5 py-3 font-bold">التصنيف</th>
                        <th className="px-5 py-3 font-bold">الكاتب</th>
                        <th className="px-5 py-3 font-bold">التاريخ</th>
                        <th className="px-5 py-3 font-bold">الحالة</th>
                        <th className="px-5 py-3 font-bold">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {recentNews.map((item) => {
                        const categoryStyle =
                          categoryStyles[item.category] ?? {
                            text: "text-zinc-300",
                            border: "border-white/10",
                            bg: "bg-white/5",
                          };

                        return (
                          <tr key={item.slug} className="hover:bg-white/[0.03]">
                            <td className="max-w-sm px-5 py-4">
                              <p className="line-clamp-1 font-bold text-white">
                                {item.title}
                              </p>
                              <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                                /news/{item.slug}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex border px-2 py-1 text-xs font-bold ${categoryStyle.border} ${categoryStyle.bg} ${categoryStyle.text}`}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-zinc-300">
                              {item.author}
                            </td>
                            <td className="px-5 py-4 text-sm text-zinc-400">
                              {item.date}
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
                                <span className="h-2 w-2 bg-emerald-400" />
                                منشور
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/news/${item.slug}`}
                                  className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                                  title="عرض المقال"
                                >
                                  <Eye size={17} />
                                </Link>
                                <Link
                                  href={`/dashboard/news/${item.slug}/edit`}
                                  className="inline-flex h-9 w-9 items-center justify-center border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                                  title="تحرير المقال"
                                >
                                  <FilePenLine size={17} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid min-w-0 gap-6 lg:grid-cols-2 2xl:grid-cols-1">
                <section className="border border-white/10 bg-[#101012] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-black">المقال النشط</h2>
                    <FilePenLine className="text-red-300" size={22} />
                  </div>

                  {featuredNews ? (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-500">
                          العنوان
                        </label>
                        <div className="mt-2 border border-white/10 bg-black/30 p-3 text-sm font-bold leading-7">
                          {featuredNews.title}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold text-zinc-500">
                            التصنيف
                          </label>
                          <div className="mt-2 border border-white/10 bg-black/30 p-3 text-sm">
                            {featuredNews.category}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500">
                            التاريخ
                          </label>
                          <div className="mt-2 border border-white/10 bg-black/30 p-3 text-sm">
                            {featuredNews.date}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-500">
                          المقتطف
                        </label>
                        <div className="mt-2 min-h-28 border border-white/10 bg-black/30 p-3 text-sm leading-7 text-zinc-300">
                          {featuredNews.excerpt}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link
                          href={`/news/${featuredNews.slug}`}
                          className="flex h-11 items-center justify-center gap-2 border border-white/10 text-sm font-black hover:bg-white/5"
                        >
                          <Eye size={17} />
                          <span>معاينة</span>
                        </Link>
                        <Link
                          href={`/dashboard/news/${featuredNews.slug}/edit`}
                          className="flex h-11 items-center justify-center gap-2 bg-white px-3 text-sm font-black text-black hover:bg-zinc-200"
                        >
                          <FilePenLine size={17} />
                          <span>تحرير</span>
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="border border-white/10 bg-[#101012] p-5">
                  <h2 className="text-xl font-black">التصنيفات</h2>
                  <div className="mt-5 space-y-3">
                    {Object.entries(categoryCounts).map(([category, count]) => {
                      const percentage = Math.round((count / news.length) * 100);
                      const categoryStyle =
                        categoryStyles[category] ?? {
                          text: "text-zinc-300",
                          border: "border-white/10",
                          bg: "bg-white/5",
                        };

                      return (
                        <div key={category}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className={categoryStyle.text}>{category}</span>
                            <span className="text-zinc-500">{count} مقال</span>
                          </div>
                          <div className="h-2 bg-white/10">
                            <div
                              className={`h-full ${categoryStyle.bg}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 2xl:col-span-1">
                  <article className="border border-white/10 bg-[#101012] p-4">
                    <CalendarDays className="text-sky-300" size={22} />
                    <p className="mt-4 text-sm text-zinc-500">آخر تحديث</p>
                    <p className="mt-1 font-black">{featuredNews?.date ?? "-"}</p>
                  </article>
                  <article className="border border-white/10 bg-[#101012] p-4">
                    <Newspaper className="text-emerald-300" size={22} />
                    <p className="mt-4 text-sm text-zinc-500">قيد العرض</p>
                    <p className="mt-1 font-black">{recentNews.length}</p>
                  </article>
                </section>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
