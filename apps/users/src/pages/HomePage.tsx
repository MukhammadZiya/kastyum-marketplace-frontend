import { Button, Container, ProductCard } from "@repo/ui";

const products = [
  {
    id: "p1",
    name: "Classic Navy Suit",
    price: "$229",
    oldPrice: "$259",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p2",
    name: "Grey Slim Blazer",
    price: "$142",
    image: "https://images.unsplash.com/photo-1531884073296-9f6b63e78f32?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p3",
    name: "Black Tailored Trousers",
    price: "$89",
    oldPrice: "$119",
    image: "https://images.unsplash.com/photo-1593032465176-c826546e3c30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p4",
    name: "Cotton Button-up Shirt",
    price: "$58",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
];

export function HomePage() {
  const heroImage = products[0]?.image;

  return (
    <div className="flex flex-col gap-16">
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-50">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-100 via-white to-neutral-200/60" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neutral-300/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-neutral-200/60 blur-3xl" />

            <div className="relative grid gap-10 items-center lg:grid-cols-2">
              <div className="p-6 sm:p-10 lg:p-12">
                <p className="text-sm font-medium tracking-widest text-neutral-600">
                  TAILORING ESSENTIALS
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                  Modern Tailoring for Everyday Life
                </h1>
                <p className="mt-4 text-base text-neutral-600">
                  Clean silhouettes and elevated textures designed for repeat wear, all
                  day comfort, and effortless styling.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Button size="lg">Shop Now</Button>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:p-12 lg:pl-2">
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-neutral-200/70 bg-white">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt="Modern tailored look"
                      loading="eager"
                      className="h-80 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-80 w-full bg-neutral-100" />
                  )}

                  <div className="absolute inset-x-6 bottom-6 rounded-xl bg-white/80 p-4 backdrop-blur">
                    <div className="text-sm font-semibold tracking-tight text-neutral-900">
                      New Season Edit
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">
                      Crafted for movement. Designed to look sharp.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                Featured Products
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Curated tailoring essentials for everyday wear.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
