import { news } from "@/data/news";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";

type Props = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: Props) {

  const article = news.find(
    (a) => a.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Header search="" setSearch={() => {}} />

      <article className="max-w-5xl mx-auto px-4 py-10">

        <div className="relative w-full h-[500px] overflow-hidden rounded-3xl">

          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
          />

        </div>

        <div className="mt-8">

          <span className="text-red-500 text-sm font-bold">
            {article.category}
          </span>

          <h1 className="text-5xl font-extrabold leading-tight mt-4">
            {article.title}
          </h1>

          <p className="text-zinc-500 mt-4">
            بواسطة {article.author} • {article.date}
          </p>

          <div className="mt-10">

                                    <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: `
                                        <h2>اختبار</h2>

                                        <p>
                                        إذا ظهر هذا بشكل صحيح فالمشكلة من البيانات.
                                        </p>

                                        <ul>
                                            <li>عنصر 1</li>
                                            <li>عنصر 2</li>
                                        </ul>
                                        `,
                                    }}
                                    />

          </div>

        </div>

      </article>

    </main>
  );
}