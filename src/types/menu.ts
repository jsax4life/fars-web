export interface MenuItem {
    name: string;
    icon: string;  // Path to the image file
    subItems?: string[]; // Optional submenu items
  }