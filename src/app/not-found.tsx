import Link from "next/link";

export default function NotFoundPage() {

  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      px-6
    ">

      <div className="text-center max-w-2xl">

        <h1 className="
          text-7xl
          md:text-9xl
          font-extrabold
          text-red-500
        ">
          404
        </h1>

        <h2 className="
          text-3xl
          md:text-5xl
          font-bold
          mt-8
        ">
          الصفحة غير موجودة
        </h2>

        <p className="
          text-zinc-400
          text-lg
          md:text-xl
          leading-loose
          mt-8
        ">

          يبدو أن الصفحة التي تبحث عنها غير موجودة
          أو ربما تم نقلها إلى مكان آخر.

        </p>

        <Link
          href="/"
          className="
            inline-flex
            items-center
            justify-center
            mt-10
            px-8
            py-4
            bg-red-600
            hover:bg-red-700
            transition
            text-lg
            font-bold
          "
        >
          العودة إلى الصفحة الرئيسية
        </Link>

      </div>

    </main>

  );
}