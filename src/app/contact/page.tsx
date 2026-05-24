export default function ContactPage() {
  return (

    <main className="min-h-screen bg-black text-white px-8 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-6">
          اتصل بنا
        </h1>

        <p className="
          text-zinc-500
          text-xl
          mb-12
        ">
          يمكنك التواصل مع فريق Maalam.net عبر البريد
          الإلكتروني أو من خلال نموذج التواصل.
        </p>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-12
        ">

          <div className="space-y-8">

            <div>

              <h2 className="
                text-2xl
                font-bold
                mb-3
              ">
                البريد الإلكتروني
              </h2>

              <p className="text-zinc-300 text-lg">
                contact@maalam.net
              </p>

            </div>

            <div>

              <h2 className="
                text-2xl
                font-bold
                mb-3
              ">
                ساعات العمل
              </h2>

              <p className="text-zinc-300 text-lg">
                يومياً على مدار الساعة
              </p>

            </div>

          </div>

          <form className="space-y-6">

            <input
              type="text"
              placeholder="الاسم"
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-800
                px-5
                py-4
                rounded-xl
                outline-none
                focus:border-red-500
              "
            />

            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-800
                px-5
                py-4
                rounded-xl
                outline-none
                focus:border-red-500
              "
            />

            <textarea
              placeholder="رسالتك"
              rows={6}
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-800
                px-5
                py-4
                rounded-xl
                outline-none
                focus:border-red-500
                resize-none
              "
            />

            <button
              type="submit"
              className="
                bg-red-600
                hover:bg-red-700
                transition
                px-8
                py-4
                rounded-xl
                text-lg
                font-bold
              "
            >
              إرسال الرسالة
            </button>

          </form>

        </div>

      </div>

    </main>

  );
}