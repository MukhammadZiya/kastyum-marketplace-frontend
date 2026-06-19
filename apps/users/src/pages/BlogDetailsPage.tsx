import Breadcrumb from "../components/Common/Breadcrumb";
import { blogData } from "../data/blogData";

export function BlogDetailsPage() {
  const post = blogData[0];

  return (
    <>
      <Breadcrumb title="Journal" pages={["journal", "article"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[870px] mx-auto px-4 sm:px-8 xl:px-0">
          <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-72 object-contain bg-neutral-50" />
            <div className="p-6 sm:p-8">
              <p className="text-sm text-neutral-500 mb-2">{post.date} - {post.author}</p>
              <h1 className="text-3xl font-semibold text-neutral-900 mb-5">{post.title}</h1>
              <p className="text-neutral-700 mb-4">
                Building a capsule wardrobe starts with a few reliable suits in neutral tones,
                then layering in shirts, knitwear, and shoes that mix across occasions. Quality
                fabric and consistent fit matter more than chasing every micro-trend.
              </p>
              <p className="text-neutral-700 mb-4">
                When shopping online, look for clear garment measurements, return windows that
                cover try-ons at home, and imagery that shows drape from more than one angle—
                especially for structured tailoring.
              </p>
              <blockquote className="border-l-4 border-[#E11D48] pl-4 italic text-neutral-700">
                Great fashion retail is part product, part guidance: honest fit notes, easy
                exchanges, and edits that respect how people actually live.
              </blockquote>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
