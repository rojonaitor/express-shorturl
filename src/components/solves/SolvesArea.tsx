import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import { useSolvesStore } from "@/store/SolvesStore";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { useTranslations } from "next-intl";

import {
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import ContextMenu from "./ContextMenu";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";

interface SolvesArea {
  displaySolves: Solve[] | null;
  currentTab: SolveTab;
}

export function SolvesArea({ displaySolves, currentTab }: SolvesArea) {
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index.SolvesPage");
  const { setStatus, solve, setSolve } = useSolvesStore();
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectSolve , setSelectSolve] = useState<boolean>(false);

  useClickOutside(submenuRef, () => {setShowOptions(false),setSelectSolve(false)});

  if (!selectedCube) {
    return (
      <EmptySolves message={t("no-cube-selection")} icon="no-cube-selected" />
    );
  }

  if (!displaySolves || displaySolves.length === 0) {
    return <EmptySolves message={t("no-solves")} icon="no-solves" />;
  }
  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    setShowOptions(true);
    setSelectSolve(true);
    setSolve(displaySolves[index]);
  };

  return (
    <VirtualizedGrid
      itemCount={displaySolves.length}
      rowHeight={60}
      cellWidth={150}
      className="grid w-full grid-cols-3 gap-3 px-3 py-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-6 mx-auto overflow-x-hidden"
      gridGap={10}
      gridHeight={"minmax(60px, 100%)"}
    >
      {(index) => (
        <div
          onClick={() => {
            setSolve(displaySolves[index]);
            setStatus(true);
          }}
          onContextMenu={(event) => handleContextMenu(event, index)}
          className={`relative grow flex items-center justify-center w-auto p-1 text-lg font-medium text-center transition duration-200 rounded-md cursor-pointer z-1 h-14 
            light:bg-neutral-100 light:shadow-sm light:shadow-neutral-400 light:hover:bg-neutral-200 light:text-zinc-800 
            dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:shadow-sm dark:text-neutral-200 
            ${
              displaySolves[index] === solve && selectSolve 
                ? "border border-solid light:border-black dark:border-white"
                : ""
            }`}
        >
          <div className="tracking-wider">
            <span className="text-md">
              {formatTime(displaySolves[index].time).split(".")[0]}
            </span>
            <span className="text-sm">
              .{formatTime(displaySolves[index].time).split(".")[1]}
            </span>
          </div>
          {displaySolves[index].plus2 ? (
            <span className="text-sm text-red-600">+2</span>
          ) : null}
          <div className="absolute z-20 text-xs top-1 left-1">
            {formatDate(displaySolves[index].endTime).slice(0, 5)}
          </div>
          {displaySolves[index].bookmark && (
            <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500">
              <StarIcon className="w-4 h-4" />
            </div>
          )}

          {displaySolves[index].comment && (
            <div className="absolute z-20 text-xs bottom-1 left-1 light:text-neutral-500 dark:text-neutral-300">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
            </div>
          )}

          {showOptions && displaySolves[index] === solve && (
            <div className="absolute top-full left-0 z-50">
              <ContextMenu
                currentTab={currentTab}
                submenuRef={submenuRef}
                solve={displaySolves[index]}
              />
            </div>
          )}
        </div>
      )}
    </VirtualizedGrid>
  );
}
