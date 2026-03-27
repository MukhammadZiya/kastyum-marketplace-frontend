import { useState } from "react";
import { AdminSectionPanel } from "./components/admin/AdminSectionPanel";
import { type AdminSection } from "./constants/adminNavigation";
import { AdminLayout } from "./layouts/AdminLayout";

function App() {
  const [activeSection, setActiveSection] = useState<AdminSection>("Dashboard");

  return (
    <AdminLayout
      activeSection={activeSection}
      onSelectSection={setActiveSection}
    >
      <AdminSectionPanel activeSection={activeSection} />
    </AdminLayout>
  );
}

export default App;