import Breadcrumb from "../components/Common/Breadcrumb";
import { blogData } from "../data/blogData";

export function BlogDetailsWithSidebarPage() {
  const post = blogData[1];

  return (
    <>
      <Breadcrumb title="Blog Details With Sidebar" pages={["blogs", "blog details with sidebar"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid lg:grid-cols-[1fr_320px] gap-8">
          <article className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-72 object-contain bg-neutral-50" />
            <div className="p-6 sm:p-8">
              <p className="text-sm text-neutral-500 mb-2">{post.date} - {post.author}</p>
              <h1 className="text-3xl font-semibold text-neutral-900 mb-5">{post.title}</h1>
              <p className="text-neutral-700 mb-4">
                This page follows the details layout with sidebar content, keeping the same visual structure.
              </p>
              <p className="text-neutral-700">
                You can later plug API-based blog content and dynamic slugs without changing the UI structure.
              </p>
            </div>
          </article>
          <aside className="space-y-5">
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="font-semibold text-neutral-900 mb-3">Search</h3>
              <input className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-4" placeholder="Search post..." />
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="font-semibold text-neutral-900 mb-3">Latest Posts</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                {blogData.slice(0, 3).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

