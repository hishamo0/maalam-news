export default function Loading() {

  return (

    <main className="
      min-h-screen
      bg-black
      flex
      items-center
      justify-center
    ">

      <div className="flex flex-col items-center gap-6">

        <div className="
          w-16
          h-16
          border-4
          border-zinc-700
          border-t-red-500
          rounded-full
          animate-spin
        "></div>

        <h2 className="
          text-white
          text-2xl
          font-bold
        ">
          جاري تحميل المحتوى...
        </h2>

      </div>

    </main>

  );
}