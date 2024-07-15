import useSolveShare from "@/hooks/useSolveShare";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

interface ShareMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  setShareSolveModal: (bool: boolean) => void;
}

export default function ShareMenu({
  submenuRef,
  setShareSolveModal,
}: ShareMenuProps) {
  const t = useTranslations("Index.SolvesPage");
  const locale = useLocale();
  const date = DateTime.now().setLocale(locale).toLocaleString();

  const {
    formatedAo5,
    formatedAo12,
    formattedLast5Solves,
    formattedLast12Solves,
  } = useSolveShare();

  const handleShareAo5 = async () => {
    setShareSolveModal(false);
    if ("clipboard" in navigator) {
      const data = `${t("share-stats-title")}: ${date} \n${t(
        "average5"
      )}: ${formatedAo5} \n\n${t("listOfTime")}: \n\n${formattedLast5Solves}`;
      await navigator.clipboard.writeText(data);
    }
  };

  const handleShareAo12 = async () => {
    setShareSolveModal(false);
    if ("clipboard" in navigator) {
      const data = `${t("share-stats-title")}: ${date} \n${t(
        "average12"
      )}: ${formatedAo12} \n\n${t("listOfTime")}: \n\n${formattedLast12Solves}`;
      await navigator.clipboard.writeText(data);
    }
  };
  return (
    <div
      className="w-40 p-2 z-50 flex  flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="text-sm">{t("share-session")}</p>

      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleShareAo5}
      >
        <div className="p-0">
          <span className="mx-1.5">{t("ao5")}</span>
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleShareAo12}
      >
        <div className="p-0">
          <span className="mx-1.5">{t("ao12")}</span>
        </div>
      </div>
    </div>
  );
}
