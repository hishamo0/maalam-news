export default function MainArticle() {
  return (
    <article className="bg-zinc-900 overflow-hidden">

      <img
        src="https://picsum.photos/1200/700"
        alt="Main Article"
        className="w-full h-[500px] object-cover"
      />

      <div className="p-8">

        <span className="text-red-500 text-sm font-semibold">
          خبر رئيسي
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mt-5">
          تطورات متسارعة في مستقبل الإعلام الرقمي العربي
        </h2>

        <p className="text-zinc-400 text-lg leading-relaxed mt-6">
          يشهد العالم العربي تحولات كبيرة في صناعة المحتوى
          والمنصات الإخبارية الحديثة المعتمدة على التقنيات
          الجديدة وتجارب المستخدم السريعة.
        </p>

      </div>

    </article>
  );
}