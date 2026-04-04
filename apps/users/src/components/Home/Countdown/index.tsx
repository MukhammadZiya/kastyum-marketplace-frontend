import { useEffect, useMemo, useState } from "react";
import { primaryImageForGroup } from "../../../data/lightWebpImages";
import { useT } from "../../../i18n";

export default function Countdown() {
  const t = useT();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadline = new Date("December 31, 2026 23:59:59").getTime();

  const segments = useMemo(
    () => [
      { label: t("countdownLabelDays"), value: days },
      { label: t("countdownLabelHours"), value: hours },
      { label: t("countdownLabelMinutes"), value: minutes },
      { label: t("countdownLabelSeconds"), value: seconds },
    ],
    [t, days, hours, minutes, seconds],
  );

  useEffect(() => {
    const tick = () => {
      const time = deadline - Date.now();
      const safe = Math.max(0, time);
      setDays(Math.floor(safe / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((safe / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((safe / 1000 / 60) % 60));
      setSeconds(Math.floor((safe / 1000) % 60));
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-[1] rounded-lg bg-[#D0E9F3] p-4 sm:p-[30px] lg:p-10 xl:p-[60px]">
          <div className="max-w-[422px] w-full">
            <span className="block font-medium text-[20px] text-blue-600 mb-[10px]">
              {t("countdownEyebrow")}
            </span>

            <h2 className="font-bold text-neutral-900 text-xl lg:text-[32px] xl:text-[44px] mb-3">
              {t("countdownTitle")}
            </h2>

            <p>{t("countdownBody")}</p>

            <div className="flex flex-wrap gap-6 mt-6">
              {segments.map((segment) => (
                <div key={segment.label}>
                  <span className="min-w-[64px] h-[58px] font-semibold text-xl lg:text-3xl text-neutral-900 rounded-lg flex items-center justify-center bg-white shadow-sm px-4 mb-2">
                    {segment.value < 10 ? `0${segment.value}` : segment.value}
                  </span>
                  <span className="block text-[14px] text-neutral-900 text-center">
                    {segment.label}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex font-medium text-[14px] text-white bg-blue-600 py-3 px-[38px] rounded-md ease-out duration-200 hover:bg-blue-700 mt-[30px]"
            >
              {t("countdownCta")}
            </a>
          </div>

          <img
            src={primaryImageForGroup(5)}
            alt={t("countdownDecorAlt")}
            className="hidden sm:block absolute right-0 bottom-0 -z-[1]"
            width={737}
            height={482}
          />
          <img
            src={primaryImageForGroup(6)}
            alt={t("countdownProductAlt")}
            className="hidden lg:block absolute right-4 xl:right-[132px] bottom-4 xl:bottom-10 -z-[1]"
            width={411}
            height={376}
          />
        </div>
      </div>
    </section>
  );
}
