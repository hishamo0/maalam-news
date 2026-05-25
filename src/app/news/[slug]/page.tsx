import { news } from "@/data/news";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({
  params,
}: Props) {

  const { slug } = await params;

  const article = news.find(
    (a) => a.slug === slug
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Header search="" setSearch={undefined as any} />

      <article className="max-w-5xl mx-auto px-4 py-10">

        <div className="relative w-full h-[500px] overflow-hidden rounded-3xl">

          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />

        </div>

        <div className="mt-8">

          <span
            className={`
              text-sm
              font-bold

              ${article.category === "سياسة" ? "text-red-500" : ""}
              ${article.category === "اقتصاد" ? "text-sky-400" : ""}
              ${article.category === "تكنولوجيا" ? "text-indigo-400" : ""}
              ${article.category === "ثقافة" ? "text-green-500" : ""}
            `}
          >
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
                __html: article.content,
              }}
            />

          </div>

        </div>

      </article>

    </main>
  );
}