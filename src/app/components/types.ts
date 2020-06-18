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
