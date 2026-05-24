import { news } from "@/data/news";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({
  params,
}: ArticlePageProps) {

  const { slug } = await params;

  const article = news.find(
    (item) => item.slug === slug
  );

  if (!article) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <h1 className="text-4xl font-bold">
          المقال غير موجود
        </h1>
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="max-w-5xl mx-auto px-4 py-16">

        <img
          src={article.image}
          alt={article.title}
          className="
            w-full
            h-[300px]
            md:h-[600px]
            object-cover
            rounded-2xl
          "
        />

        <div className="mt-10">

          <span className="text-red-500 text-lg font-bold">
            {article.category}
          </span>

          <h1 className="
            text-4xl
            md:text-6xl
            font-extrabold
            leading-tight
            mt-6
          ">
            {article.title}
          </h1>

          <div className="
            flex
            items-center
            gap-4
            text-zinc-500
            mt-6
            text-sm
          ">

            <span>Maalam.net</span>

            <span>•</span>

            <span>منذ ساعتين</span>

          </div>

          <div className="
            mt-12
            space-y-8
            text-zinc-300
            leading-loose
            text-xl
          ">

            <p>
              يشهد العالم تغيرات متسارعة في مختلف المجالات،
              وخاصة في التكنولوجيا والإعلام الرقمي، حيث أصبحت
              المنصات الحديثة تلعب دوراً أساسياً في نقل الأخبار
              وصناعة المحتوى.
            </p>
            <div className="
                          w-full
                          h-40
                          border
                          border-zinc-800
                          bg-zinc-950
                          flex
                          items-center
                          justify-center
                          text-zinc-500
                          text-lg
                        ">

                          مساحة إعلانية داخل المقال

            </div>

            <p>
              تسعى منصة Maalam.net إلى تقديم تجربة عربية حديثة
              تعتمد على السرعة والوضوح والتصميم العصري مع التركيز
              على جودة المحتوى وسهولة الوصول للمعلومات.
            </p>

            <p>
              ويُتوقع أن تشهد السنوات القادمة تطوراً أكبر في
              اعتماد تقنيات الذكاء الاصطناعي والتحليل الرقمي
              في صناعة الإعلام الحديث.
            </p>

          </div>

        </div>

      </div>
      <div className="mt-24">

  <h2 className="
    text-3xl
    md:text-4xl
    font-extrabold
    mb-10
  ">
    مقالات ذات صلة
  </h2>

  <div className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-8
  ">

    {news
      .filter((item) => item.slug !== article.slug)
      .slice(0, 3)
      .map((item, index) => (

        <a
          key={index}
          href={`/article/${item.slug}`}
          className="
            bg-zinc-900
            overflow-hidden
            hover:bg-zinc-800
            transition
            group
          "
        >

          <img
            src={item.image}
            alt={item.title}
            className="
              w-full
              h-52
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          <div className="p-5">

            <span className="text-red-500 text-sm font-bold">
              {item.category}
            </span>

            <h3 className="
              text-2xl
              font-bold
              leading-relaxed
              mt-4
            ">
              {item.title}
            </h3>

          </div>

        </a>

    ))}

  </div>

</div>

    </main>

  );
}