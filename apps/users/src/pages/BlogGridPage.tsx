import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { blogData } from "../data/blogData";

export function BlogGridPage() {
  return (
    <>
      <Breadcrumb title="Style journal" pages={["journal", "stories"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid md:grid-cols-2 gap-6">
          {blogData.map((post) => (
            <article key={post.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-52 object-contain bg-neutral-50" />
              <div className="p-5">
                <p className="text-sm text-neutral-500 mb-2">{post.date} - {post.category}</p>
                <h2 className="font-semibold text-xl text-neutral-900 mb-3">{post.title}</h2>
                <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                <Link to="/blogs/blog-details" className="text-blue-600 font-medium">Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

