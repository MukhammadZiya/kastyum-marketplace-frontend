import { useState } from "react";
import { SellerSectionPanel } from "./components/seller/SellerSectionPanel";
import { type SellerSection } from "./constants/sellerNavigation";
import { SellerLayout } from "./layouts/SellerLayout";

function App() {
  const [activeSection, setActiveSection] =
    useState<SellerSection>("Dashboard");

  return (
    <SellerLayout
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      <SellerSectionPanel activeSection={activeSection} />
    </SellerLayout>
  );
}

export default App;