import Link from "next/link";

const trendingArticles = [
  {
    category: "سياسة",
    color: "text-red-500",
    title: "تصاعد التحركات الدبلوماسية بشأن إيران وسط حديث عن اتفاق مرتقب",
    date: "26 مايو 2026",
    href: "/news/middle-east-iran-diplomatic-moves-2026",
  },
  {
    category: "اقتصاد",
    color: "text-sky-400",
    title: "أزمة الديون العالمية تبطئ النمو الاقتصادي وتضغط على الأسواق",
    date: "25 مايو 2026",
    href: "/news/global-debt-crisis-economic-slowdown",
  },
  {
    category: "تكنولوجيا",
    color: "text-indigo-400",
    title: "شركات التقنية تتسابق في تطوير نماذج الذكاء الاصطناعي",
    date: "24 مايو 2026",
    href: "/news/ai-companies-race-next-generation-models-2026",
  },
  {
    category: "ثقافة",
    color: "text-green-500",
    title: "سقوط الحكم الملكي في العراق عام 1958 وتحولاته السياسية",
    date: "25 مايو 2026",
    href: "/news/iraq-monarchy-fall-1958",
  },
];

export default function TrendingSidebar() {
  return (
    <aside className="bg-zinc-950 p-6 md:p-8 border border-zinc-800 rounded-2xl">
      <h3 className="text-2xl font-extrabold mb-8">
        الأكثر قراءة
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {trendingArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="group block border-b border-zinc-800 pb-5 xl:border-b-0 xl:border-l xl:pl-6 xl:pb-0 last:border-0"
          >
            <span className={`${article.color} text-sm font-bold`}>
              {article.category}
            </span>

            <h4 className="text-lg font-bold leading-relaxed mt-2 group-hover:text-red-400 transition-colors">
              {article.title}
            </h4>

            <p className="mt-3 text-sm text-zinc-500">
              {article.date}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
