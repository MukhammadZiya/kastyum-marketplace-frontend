import Hero from "./Hero";
import Categories from "./Categories";
import NewArrivals from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Countdown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrivals />
      <PromoBanner />
      <Countdown />
      <Testimonials />
      <Newsletter />
    </main>
  );
}

