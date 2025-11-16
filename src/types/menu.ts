export interface SubMenuItem {
    name: string;
    path: string;
}

export interface MenuItem {
    name: string;
    icon: string;  // Path to the image file
    path?: string; // Optional - if not provided, item is a parent with subItems
    subItems?: SubMenuItem[]; // Optional submenu items
  }