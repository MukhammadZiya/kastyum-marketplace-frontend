import { useEffect, useRef } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: string;
  usePic?: boolean;
}

declare global {
  interface Window {
    onTelegramSellerAuth: (user: TelegramUser) => void;
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
    window.onTelegramSellerAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute("data-radius", cornerRadius.toString());
    }
    script.setAttribute("data-onauth", "onTelegramSellerAuth(user)");
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
        containerRef.current.replaceChildren();
      }
    };
  }, [botName, onAuth, buttonSize, cornerRadius, requestAccess, usePic]);

  return <div ref={containerRef} className="flex justify-center" />;
};
