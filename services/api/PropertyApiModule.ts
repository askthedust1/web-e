export interface PropertyApiProps {
  count: number;
  next: string;
  previous: string;
  page_count: number;
  results: {
    id: number;
    slug: string;
    title: string;
    price: string;
    min_pay: string;
    created_at: string;
    main_image: {
      id: number;
      image: string;
      is_main: boolean;
    };
  }[];
}

export interface PropertyDeteiltProps {
  id: number;
  slug: string;
  title: string;
  price: string;
  min_pay: string;
  desc: string;
  created_at: string;
  images: {
    id: number;
    image: string;
    is_main: boolean;
  }[];
  other_ownerships: {
    id: number;
    slug: string;
    title: string;
    price: string;
    min_pay: string;
    created_at: string;
    main_image: {
      id: number;
      image: string;
      is_main: boolean;
    };
  }[];
}
