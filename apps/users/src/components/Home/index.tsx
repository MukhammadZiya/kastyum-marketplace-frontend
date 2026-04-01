import Hero from "./Hero";
import NewArrivals from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Countdown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <NewArrivals />
      <PromoBanner />
      <Countdown />
      <Testimonials />
      <Newsletter />
    </main>
  );
}

