export default function TrendingSidebar() {
  return (

    <aside className="bg-zinc-950 p-8 border border-zinc-800">

      <h3 className="text-2xl font-extrabold mb-8">
        الأكثر قراءة
      </h3>

      <div className="space-y-8">

        <div>
          <span className="text-red-500 text-sm font-bold">
            سياسة
          </span>

          <h4 className="text-lg font-bold leading-relaxed mt-2">
            تطورات سياسية متسارعة في المنطقة
          </h4>
        </div>

        <div>
          <span className="text-sky-400 text-sm font-bold">
            اقتصاد
          </span>

          <h4 className="text-lg font-bold leading-relaxed mt-2">
            ارتفاع ملحوظ في الاستثمارات التقنية
          </h4>
        </div>

        <div>
          <span className="text-indigo-400 text-sm font-bold">
            تكنولوجيا
          </span>

          <h4 className="text-lg font-bold leading-relaxed mt-2">
            الذكاء الاصطناعي يواصل تغيير المشهد الرقمي
          </h4>
        </div>

        <div>
          <span className="text-green-500 text-sm font-bold">
            ثقافة
          </span>

          <h4 className="text-lg font-bold leading-relaxed mt-2">
            عودة قوية للإنتاج الثقافي العربي
          </h4>
        </div>

      </div>
      <div className="
            mt-10
            h-96
            border
            border-zinc-800
            bg-zinc-950
            flex
            items-center
            justify-center
            text-zinc-500
            text-center
            px-4
          ">

            مساحة إعلانية جانبية 300x600

      </div>

    </aside>
    

  );
}