
export enum Category {
  TV = 'Truyền hình',
  Movies = 'Phim',
  Sports = 'Thể thao',
  Utilities = 'Tiện ích',
}

export interface App {
  id: number;
  name:string;
  icon: string | File; // Can be a URL string or a File object
  category: Category;
  description: string;
  installed?: boolean;
  apk?: File; // Store the APK as a File object
  apkUrl?: string; // Keep for initial apps
}