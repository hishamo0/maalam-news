export default function AboutPage() {
  return (

    <main className="min-h-screen bg-black text-white px-8 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-6">
          من نحن
        </h1>

        <p className="
          text-zinc-500
          text-xl
          mb-12
        ">
          منصة إعلامية عربية مستقلة تغطي أبرز الأحداث
          والتطورات في العالم العربي والعالم.
        </p>

        <div className="
          space-y-8
          text-zinc-300
          leading-loose
          text-xl
        ">

          <p>
            Maalam.net منصة إخبارية عربية حديثة تهدف إلى تقديم
            محتوى سريع، موثوق، واحترافي في مجالات السياسة،
            الاقتصاد، التكنولوجيا، والثقافة.
          </p>

          <p>
            نعمل على بناء تجربة إعلامية عصرية تعتمد على
            البساطة، السرعة، والتصميم الحديث مع التركيز
            على جودة المحتوى وسهولة الوصول إلى المعلومات.
          </p>

          <p>
            هدفنا هو تقديم منصة عربية تجمع بين السرعة
            الصحفية والهوية البصرية الحديثة مع مواكبة
            التطورات الرقمية في عالم الإعلام.
          </p>

        </div>

        <div className="mt-16">

          <h2 className="
            text-3xl
            font-bold
            mb-6
          ">
            رؤيتنا
          </h2>

          <p className="
            text-zinc-300
            leading-loose
            text-xl
          ">
            نسعى إلى بناء منصة إعلامية عربية حديثة تجمع
            بين المصداقية، السرعة الصحفية، والتجربة
            البصرية العصرية مع التركيز على تقديم محتوى
            رقمي عالي الجودة للقارئ العربي.
          </p>

        </div>

        <div className="mt-16">

          <h2 className="
            text-3xl
            font-bold
            mb-6
          ">
            مجالات التغطية
          </h2>

          <ul className="
            space-y-4
            text-xl
            text-zinc-300
          ">

            <li>• الأخبار السياسية</li>

            <li>• الاقتصاد والأسواق</li>

            <li>• التكنولوجيا والذكاء الاصطناعي</li>

            <li>• الثقافة والمجتمع</li>

            <li>• التقارير والتحليلات</li>

          </ul>

        </div>

      </div>

    </main>

  );
}