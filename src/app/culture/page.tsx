import NewsCard from "@/components/NewsCard";
import SectionTitle from "@/components/SectionTitle";
import { news } from "@/data/news";

export default function CulturePage() {

const cultureNews = news.filter(
  (item) => item.category === "ثقافة"
);

  return (

    <main className="min-h-screen bg-black text-white px-8 py-16">

      <div className="max-w-7xl mx-auto">

        <SectionTitle
          title="ثقافة"
          color="bg-green-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {cultureNews.map((item, index) => (

            <NewsCard
              key={index}
              category={item.category}
              title={item.title}
              image={item.image}
              slug={item.slug}
              excerpt={item.excerpt}
              author={item.author}
              date={item.date}
            />

          ))}

        </div>

      </div>

    </main>

  );
}