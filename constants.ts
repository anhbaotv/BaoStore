
import { App, Category } from './types';

export const CATEGORIES: Category[] = [
  Category.TV,
  Category.Movies,
  Category.Sports,
  Category.Utilities,
];

export const INITIAL_APPS: App[] = [
  {
    id: 1,
    name: 'FPT Play',
    icon: 'https://picsum.photos/seed/fptplay/200/200',
    category: Category.TV,
    description: 'Ứng dụng xem truyền hình, phim truyện và thể thao hàng đầu Việt Nam.',
    installUrl: '#',
  },
  {
    id: 2,
    name: 'VTV Go',
    icon: 'https://picsum.photos/seed/vtvgo/200/200',
    category: Category.TV,
    description: 'Xem trực tiếp các kênh truyền hình của Đài Truyền hình Việt Nam.',
    installUrl: '#',
  },
  {
    id: 3,
    name: 'Netflix',
    icon: 'https://picsum.photos/seed/netflix/200/200',
    category: Category.Movies,
    description: 'Kho phim và chương trình truyền hình khổng lồ với chất lượng cao.',
    installUrl: '#',
  },
  {
    id: 4,
    name: 'Galaxy Play',
    icon: 'https://picsum.photos/seed/galaxyplay/200/200',
    category: Category.Movies,
    description: 'Thưởng thức phim chiếu rạp mới nhất và các bộ phim Việt đặc sắc.',
    installUrl: '#',
  },
  {
    id: 5,
    name: 'K+',
    icon: 'https://picsum.photos/seed/kplus/200/200',
    category: Category.Sports,
    description: 'Trực tiếp các giải đấu thể thao đỉnh cao như Ngoại hạng Anh, Formula 1.',
    installUrl: '#',
  },
  {
    id: 6,
    name: 'On Sports TV',
    icon: 'https://picsum.photos/seed/onsports/200/200',
    category: Category.Sports,
    description: 'Cập nhật tin tức và xem trực tiếp các sự kiện thể thao trong nước và quốc tế.',
    installUrl: '#',
  },
  {
    id: 7,
    name: 'ES File Explorer',
    icon: 'https://picsum.photos/seed/esfile/200/200',
    category: Category.Utilities,
    description: 'Trình quản lý tập tin mạnh mẽ và đa chức năng cho Android TV.',
    installUrl: '#',
  },
  {
    id: 8,
    name: 'Puffin TV Browser',
    icon: 'https://picsum.photos/seed/puffin/200/200',
    category: Category.Utilities,
    description: 'Trình duyệt web được tối ưu hóa cho trải nghiệm trên TV.',
    installUrl: '#',
  },
  {
    id: 9,
    name: 'Youtube',
    icon: 'https://picsum.photos/seed/youtube/200/200',
    category: Category.TV,
    description: 'Xem video, clip ca nhạc, chương trình giải trí phổ biến nhất thế giới.',
    installUrl: '#',
  },
  {
    id: 10,
    name: 'HBO Go',
    icon: 'https://picsum.photos/seed/hbogo/200/200',
    category: Category.Movies,
    description: 'Xem các bộ phim bom tấn và series phim độc quyền của HBO.',
    installUrl: '#',
  },
];
