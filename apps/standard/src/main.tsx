import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const SELLER_BASENAME = "/seller";
const ADMIN_BASENAME = "/admin";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
      },
    },
  });
}

async function mountSellerApp(root: ReturnType<typeof createRoot>) {
  const [{ default: App }, { I18nProvider }] = await Promise.all([
    import("../../sellers/src/App"),
    import("../../sellers/src/i18n"),
  ]);

  root.render(
    <StrictMode>
      <QueryClientProvider client={createQueryClient()}>
        <I18nProvider>
          <App basename={SELLER_BASENAME} />
        </I18nProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

async function mountAdminApp(root: ReturnType<typeof createRoot>) {
  const [{ default: App }, { I18nProvider }] = await Promise.all([
    import("../../admin/src/App"),
    import("../../admin/src/i18n"),
  ]);

  root.render(
    <StrictMode>
      <QueryClientProvider client={createQueryClient()}>
        <I18nProvider>
          <App basename={ADMIN_BASENAME} />
        </I18nProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

async function mountUserApp(root: ReturnType<typeof createRoot>) {
  const [{ default: App }, { AppProviders }] = await Promise.all([
    import("../../users/src/App"),
    import("../../users/src/context/appProviders"),
  ]);

  root.render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
}

async function mount() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element was not found.");
  }

  const root = createRoot(rootElement);
  const path = window.location.pathname;

  if (path === SELLER_BASENAME || path.startsWith(`${SELLER_BASENAME}/`)) {
    await mountSellerApp(root);
    return;
  }

  if (path === ADMIN_BASENAME || path.startsWith(`${ADMIN_BASENAME}/`)) {
    await mountAdminApp(root);
    return;
  }

  await mountUserApp(root);
}

void mount();
