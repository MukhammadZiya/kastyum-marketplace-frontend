import { Link } from "react-router-dom";

export default function Breadcrumb({
  title,
  pages,
}: {
  title: string;
  pages: string[];
}) {
  return (
    <section className="bg-neutral-100 py-7">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <div className="mt-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          {pages.map((p, i) => (
            <span key={`${p}-${i}`}>
              {" "}
              / <span className="capitalize">{p}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

