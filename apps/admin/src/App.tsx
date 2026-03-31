import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminAppShell } from "./layouts/AdminAppShell";
import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { ModuleTablePage } from "./pages/ModuleTablePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminAppShell />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="users"
            element={
              <ModuleTablePage
                navId="users"
                tableTitle="All users"
                tableDescription="Manage buyer accounts, roles, and status."
              />
            }
          />
          <Route
            path="sellers"
            element={
              <ModuleTablePage
                navId="sellers"
                tableTitle="Sellers"
                tableDescription="Review stores, onboarding, and compliance."
              />
            }
          />
          <Route
            path="products"
            element={
              <ModuleTablePage
                navId="products"
                tableTitle="Products"
                tableDescription="Moderate listings before they go live."
              />
            }
          />
          <Route
            path="orders"
            element={
              <ModuleTablePage
                navId="orders"
                tableTitle="Orders"
                tableDescription="Track lifecycle, issues, and interventions."
              />
            }
          />
          <Route
            path="reports"
            element={
              <ModuleTablePage
                navId="reports"
                tableTitle="Reports"
                tableDescription="Complaints, disputes, and abuse reports."
              />
            }
          />
          <Route
            path="cms"
            element={
              <ModuleTablePage
                navId="cms"
                tableTitle="Content"
                tableDescription="Banners, highlights, and managed storefront copy."
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
