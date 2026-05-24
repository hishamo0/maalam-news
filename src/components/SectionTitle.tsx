type SectionTitleProps = {
  title: string;
  color: string;
};

export default function SectionTitle({
  title,
  color,
}: SectionTitleProps) {
  return (

    <div className="flex items-center gap-4 mb-8">

      <div
        className={`w-2 h-10 ${color}`}
      />

      <h2 className="text-3xl font-extrabold">
        {title}
      </h2>

    </div>

  );
}