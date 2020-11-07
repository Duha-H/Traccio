import { TimelineDatum } from '../models/types';

export interface DropdownItem {
  text: string;
  readonly type: "button" | "link" | "item" | "theme-toggle";
  readonly callback?: () => void;
  readonly link?: string;
  readonly params?: {[key: string]: string};
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
  data: TimelineDatum[];
  width?: number;
  height?: number;
  size?: number; // size in pixels
  colors?: string[]; // timeline marker colors
  colorMappings?: { [status: string]: string};
  isInteractive?: boolean; // display or click timeline markers
}

export interface TimelineTooltipPropType {
  x: number;
  y: number;
  text?: string;
  color?: string;
}

export interface ConfettiPropType {
  colors: string[];
  count?: number;  // number of confetti particles?
  animDuration?: number; // animation duration in ms
}
