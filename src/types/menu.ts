export interface MenuItem {
    name: string;
    icon: string;  // Path to the image file
    path: string; 
    subItems?: string[]; // Optional submenu items
  }