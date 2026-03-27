import Breadcrumb from "../components/Common/Breadcrumb";
import { blogData } from "../data/blogData";

export function BlogDetailsPage() {
  const post = blogData[0];

  return (
    <>
      <Breadcrumb title="Blog Details" pages={["blogs", "blog details"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[870px] mx-auto px-4 sm:px-8 xl:px-0">
          <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-72 object-contain bg-neutral-50" />
            <div className="p-6 sm:p-8">
              <p className="text-sm text-neutral-500 mb-2">{post.date} - {post.author}</p>
              <h1 className="text-3xl font-semibold text-neutral-900 mb-5">{post.title}</h1>
              <p className="text-neutral-700 mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry standard since the 1500s.
              </p>
              <p className="text-neutral-700 mb-4">
                It has survived not only five centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged and still useful in modern web design.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-neutral-700">
                A good shopping experience is not only about products, but also content, trust, and guidance.
              </blockquote>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

