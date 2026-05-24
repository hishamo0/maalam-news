import { articles } from "@/data/articles";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: Props) {

  const article = articles.find(
    (a) => a.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-10 text-white">

      <h1 className="text-4xl font-bold mb-6">
        {article.title}
      </h1>

      <p className="text-zinc-300 leading-8 text-lg">
        {article.content}
      </p>

    </article>
  );
}