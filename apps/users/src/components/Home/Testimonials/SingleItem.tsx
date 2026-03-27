import type { Testimonial } from "../../../data/testimonialsData";

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={testimonial.img}
          alt={testimonial.name}
          width={54}
          height={54}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold text-neutral-900">{testimonial.name}</h3>
          <p className="text-sm text-neutral-600">{testimonial.designation}</p>
        </div>
      </div>

      <p className="mt-5 text-neutral-700">{testimonial.content}</p>
    </div>
  );
}

