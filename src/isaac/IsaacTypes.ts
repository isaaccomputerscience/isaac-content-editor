import { createContext } from "react";
import { Item } from "../isaac-data-types";

export interface BooleanNotation {
  ENG?: boolean;
  MATH?: boolean;
}

export const NON_STATIC_FIGURE_FLAG = "NON_STATIC_FIGURE";
export interface FigureNumbersById {
  [figureId: string]: number | typeof NON_STATIC_FIGURE_FLAG | undefined;
}
export const FigureNumberingContext = createContext<FigureNumbersById>({});

export const NULL_CLOZE_ITEM_ID = "NULL_CLOZE_ITEM" as const;
export const NULL_CLOZE_ITEM: Item = {
  type: "item",
  id: NULL_CLOZE_ITEM_ID,
};
// Matches: [drop-zone], [drop-zone|w-50], [drop-zone|h-50] or [drop-zone|w-50h-200]
export const dropZoneRegex = /\[drop-zone(?<params>\|(?<index>i-\d+?)?(?<width>w-\d+?)?(?<height>h-\d+?)?)?]/g;
