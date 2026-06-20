import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TelegramLoginButton } from "../components/Auth/TelegramLoginButton";
import { useMemberTelegramLogin } from "../hooks/members";

export function TelegramLoginPage() {
  const navigate = useNavigate();
  const telegramLogin = useMemberTelegramLogin();
  const [error, setError] = useState("");

  return (
    <section className="min-h-[70vh] bg-[#F7F7F8] py-12">
      <div className="mx-auto max-w-[480px] px-4">
        <div className="mx-auto max-w-[570px] rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] text-center">
          <p className="mb-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
            iBerry
          </p>
          <h2 className="mb-1 text-2xl font-black tracking-tight text-neutral-950">
            Telegram
          </h2>
          <p className="mb-8 text-sm text-neutral-500">
            Telegram orqali ulaning
          </p>

          {error ? (
            <p className="mb-5 text-sm text-red-600" role="alert">{error}</p>
          ) : null}

          <div className="flex flex-col items-center gap-4">
            <TelegramLoginButton
              botName={import.meta.env.VITE_TELEGRAM_BOT_NAME || "iBerry_official_bot"}
              onAuth={(user) => {
                setError("");
                telegramLogin.mutate(user, {
                  onSuccess: () => navigate("/"),
                  onError: (err) =>
                    setError(err instanceof Error ? err.message : "Telegram login failed"),
                });
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-8 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition mx-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </button>
        </div>
      </div>
    </section>
  );
}
