import { TimelineDatum } from '../models/types';

export interface DropdownItem {
  text: string;
  readonly type: "button" | "link" | "item" | "toggle";
  readonly callback?: () => void;
  readonly link?: string;
}

export interface BreadcrumbsData {
  current: {
    name: string,
    url: string
  };
  paths: {
    name: string,
    url: string,
  }[];
}

export interface TimelinePropType {
  width: number;
  height: number;
  data: TimelineDatum[];
  size?: number; // size in pixels
  colors?: string[]; // timeline marker colors
  isInteractive?: boolean; // display or click timeline markers
}

export interface TimelineTooltipPropType {
  x: number;
  y: number;
  text?: string;
  color?: string;
}
