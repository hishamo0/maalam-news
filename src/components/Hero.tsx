export default function Hero() {
  return (
    <section className="w-full px-4 py-20">

      <div className="bg-zinc-900 overflow-hidden">

        <img
          src="https://picsum.photos/1200/600"
          alt="Hero"
          className="w-full h-[350px] md:h-[550px] object-cover hover:scale-105 transition duration-700"
        />

        <div className="p-6 md:p-10">

          <span className="text-red-500 font-semibold text-lg">
            خبر عاجل
          </span>

          <h1 className="text-3xl md:text-7xl font-extrabold leading-tight mt-6">
            بداية بناء منصة Maalam.net الإخبارية الحديثة
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mt-8 max-w-3xl">
            مشروع عربي حديث يهدف إلى تقديم تجربة إخبارية
            سريعة وعصرية باستخدام أحدث تقنيات الويب.
          </p>

        </div>

      </div>

    </section>
  );
}