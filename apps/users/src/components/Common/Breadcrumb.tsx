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
    <section className="bg-[#FAFAFB] py-5">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 xl:px-0">
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        <div className="mt-2 text-sm text-neutral-600">
          <Link to="/" className="hover:text-[#BE123C]">
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
