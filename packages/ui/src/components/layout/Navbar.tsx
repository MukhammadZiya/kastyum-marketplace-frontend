import { Container } from "../Container";
import { Button } from "../Button";

interface NavbarProps {
  logo?: string;
}

export function Navbar({ logo = "SuitStore" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <Container className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <a href="/" className="text-base font-semibold tracking-tight text-black sm:text-lg">
            {logo}
          </a>

          <nav className="hidden text-sm lg:flex items-center gap-8 text-neutral-700">
            <a
              href="/products"
              className="transition-colors duration-200 hover:text-neutral-900"
            >
              Shop
            </a>
            <a
              href="/products?category=suits"
              className="transition-colors duration-200 hover:text-neutral-900"
            >
              Suits
            </a>
            <a
              href="/products?category=blazers"
              className="transition-colors duration-200 hover:text-neutral-900"
            >
              Blazers
            </a>
            <a
              href="/products?category=accessories"
              className="transition-colors duration-200 hover:text-neutral-900"
            >
              Accessories
            </a>
          </nav>
        </div>

        <div className="hidden flex-1 max-w-md lg:flex">
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search tailoring"
            className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 text-sm outline-none placeholder:text-neutral-400 transition-colors duration-200 focus:border-neutral-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="md">
            Login
          </Button>
          <Button variant="primary" size="md">
            Cart
          </Button>
        </div>
      </Container>
    </header>
  );
}