import Breadcrumb from "../components/Common/Breadcrumb";
import { blogData } from "../data/blogData";

export function BlogGridWithSidebarPage() {
  return (
    <>
      <Breadcrumb title="Blog Grid With Sidebar" pages={["blogs", "blog grid with sidebar"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="grid md:grid-cols-2 gap-6">
            {blogData.map((post) => (
              <article key={post.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-48 object-contain bg-neutral-50" />
                <div className="p-5">
                  <p className="text-sm text-neutral-500 mb-2">{post.date}</p>
                  <h2 className="font-semibold text-lg text-neutral-900 mb-3">{post.title}</h2>
                  <p className="text-neutral-600 text-sm">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          <aside className="space-y-5">
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="font-semibold text-neutral-900 mb-3">Categories</h3>
              <ul className="space-y-2 text-neutral-600">
                <li>Technology</li>
                <li>Guides</li>
                <li>Business</li>
                <li>Lifestyle</li>
              </ul>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="font-semibold text-neutral-900 mb-3">Latest Posts</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                {blogData.slice(0, 3).map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

