export interface AllServicePoints {
  branches: Branches[];
  bankomats: Branches[];
  pos_terminals: Branches[];
  payment_points: Branches[];
}

export interface BranchesResponse {
  count: number;
  next: string;
  previous: string,
  page_count: number,
  results: Branches[]
}

export interface Branches {
  is_open: boolean;
  icon: string;
  branch_type_display: string;
  id: number;
  slug: string;
  name: string;
  address: string;
  lng: string;
  lat: string;
  phones: {
    id: number;
    phone: string;
  }[];
  status: string;
  type: string;
  device_id: string;
  region: {
    id: number;
    name: string;
  };
  captions: { id: number; caption: string }[];
  has_ground_mode: false;
  ground_mode_till: string;
  currencies: {
    id: number;
    name: string;
    code: string;
    icon: string;
  }[];
  city: {
    name: string;
    id: number;
  };
  day_n_night: boolean
}
export interface Cities {
  id: number;
  name: string;
  cities?: any[];
}
export interface Bankomats {
  is_open: boolean;
  icon: string;
  id: number;
  slug: string;
  name: string;
  address: string;
  lng: string;
  lat: string;
  phones: {
    id: number;
    phone: string;
  }[];
  status: string;
}
export enum ServicePointsEnum {
  Branches = 1,
  PostTerminals = 2,
  Bankomats = 3,
  PaymentService = 4,
}

export interface PosTerminals {
  is_open: boolean;
  icon: string;
  id: number;
  slug: string;
  name: string;
  address: string;
  lng: string;
  lat: string;
  phones: {
    id: number;
    phone: string;
  }[];
  status: string;
  type: string;
  device_id: string;
  currencies: {
    id: number;
    name: string;
    code: string;
    icon: string;
  }[];
}
export interface PaymentPoints {
  is_open: boolean;
  icon: string;
  id: number;
  slug: string;
  name: string;
  address: string;
  lng: string;
  lat: string;
  phones: {
    id: number;
    phone: string;
  }[];
  status: string;
  type: string;
  device_id: string;
  currencies: {
    id: number;
    name: string;
    code: string;
    icon: string;
  }[];
}

export interface ServiceDetailProps {
  id: number;
  region: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
  name: string;
  address: string;
  day_n_night: boolean;
  is_closed: boolean;
  is_closed_till: string;
  additional_info: string;
  lng: string;
  lat: string;
  week_days: {
    id: number;
    day: string;
    open_from: string;
    open_till: string;
    break_from: string;
    break_till: string;
  }[];
  phones: {
    id: number;
    phone: string;
  }[];
  status: string;
  icon: string;
  captions: { id: number; captions: string }[];
  has_ground_mode: false;
  ground_mode_till: string;
  currencies: {
    id: number;
    name: string;
    code: string;
    icon: string;
  }[];
}

export interface SEOpage {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_title: string;
  og_image: string;
  og_description: string;
}
