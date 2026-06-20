import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: string;
  usePic?: boolean;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export const TelegramLoginButton = ({
  botName,
  onAuth,
  buttonSize = "large",
  cornerRadius,
  requestAccess = "write",
  usePic = true,
}: TelegramLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = (user: any) => {
      onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute("data-radius", cornerRadius.toString());
    }
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", requestAccess);
    if (!usePic) {
      script.setAttribute("data-userpic", "false");
    }
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

  return <div ref={containerRef} className="flex justify-center" />;
};

interface TelegramIconButtonProps {
  botId: string | number;
  onAuth: (user: any) => void;
  disabled?: boolean;
}

export function TelegramIconButton({ disabled }: Pick<TelegramIconButtonProps, "disabled">) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/telegram-login")}
      disabled={disabled}
      title="Continue with Telegram"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] shadow-sm transition hover:bg-[#1a8bbf] active:scale-95 disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    </button>
  );
}
