import { Link } from "react-router-dom";
import { useT } from "../../i18n";

export default function Breadcrumb({
  title,
  pages,
}: {
  title: string;
  pages: string[];
}) {
  const t = useT();

  return (
    <section className="bg-neutral-100 py-7">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <div className="mt-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-blue-600">
            {t("breadcrumbHome")}
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

