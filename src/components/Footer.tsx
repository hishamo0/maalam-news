export default function Footer() {
  return (

    <footer className="border-t border-zinc-800 mt-16">

      <div className="w-full px-8 py-10">

        <div className="max-w-4xl">

          <h2 className="text-4xl font-extrabold">
            Maalam.net
          </h2>

          <p className="text-zinc-300 mt-6 leading-loose text-xl max-w-3xl">
            منصة إخبارية عربية حديثة تهدف إلى تقديم محتوى سريع،
            احترافي.
          </p>

        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-zinc-500 text-sm">
            © 2026 Maalam.net — جميع الحقوق محفوظة
          </p>

          <div className="flex items-center gap-6 text-zinc-400 text-sm">

            <a href="/about" className="hover:text-white transition">
              من نحن
            </a>

            <a href="/privacy-policy" className="hover:text-white transition">
              سياسة الخصوصية
            </a>

            <a href="/contact" className="hover:text-white transition">
              تواصل معنا
            </a>

            <a href="/terms" className="hover:text-white transition">
              شروط الاستخدام
            </a>

          </div>

        </div>

      </div>

    </footer>

  );
}