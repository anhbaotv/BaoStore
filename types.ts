
export enum Category {
  TV = 'Truyền hình',
  Movies = 'Phim',
  Sports = 'Thể thao',
  Utilities = 'Tiện ích',
}

export interface App {
  id: number;
  name:string;
  icon: string;
  category: Category;
  description: string;
  installed?: boolean;
  installUrl?: string;
}
