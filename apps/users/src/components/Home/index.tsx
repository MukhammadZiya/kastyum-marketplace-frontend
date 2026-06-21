import Hero from "./Hero";
import NewArrivals from "./NewArrivals";
import FrequentlyBought from "./FrequentlyBought";

export default function Home() {
  return (
    <main>
      <div className="home-section-animate"><Hero /></div>
      <div className="home-section-animate"><NewArrivals /></div>
      <div className="home-section-animate"><FrequentlyBought /></div>
    </main>
  );
}
