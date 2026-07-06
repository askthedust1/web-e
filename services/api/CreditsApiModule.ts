export interface Credits {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_title: string;
  og_image: string;
  og_description: string;
  id: 1;
  main_title: string;
  support_phone: string;
  support_email: string;
  application_caption: string;
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
}

export interface CreditsTypeOne {
  show_calculator: boolean,
  og_description: string;
  og_image: string;
  og_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_title: string;
  banner_title: string;
  banner_subtitle: string;
  banner_button_text: string;
  banner_button_link: string;
  banner_image: string;
  banner_image_mob: string;
  banner_title_hex: string;
  banner_subtitle_hex: string;
  id: number;
  slug: string;
  name: string;
  short_desc: string;
  shorts: {
    id: number;
    key: string;
    value: string;
  }[];
  banner_bg: string
  banner_bg_mob: string
  currencies: {
    id: number;
    name: string;
    code: string;
    icon: string;
  }[];
  main_title: string;
  main_desc: string;
  second_title: string;
  advantages: {
    desc: string;
    icon: string;
    id: number;
  }[];
  second_desc: string;
  sections_title: string;
  calcs: {
    currency: {
      id: number;
      name: string;
      code: string;
      icon: string;
    };
    calcs: [];
  }[];
  steps: {
    id: number;
    order: number;
    desc: string;
  }[];
  sections: {
    id: number;
    title: string;
    desc: string;
  }[];
  faqs: [];
  calc_currencies: {
    calc_percents: {
      id: number;
      period: {
        end: number;
        id: number;
        measure: string;
        start: number;
      };
      perc: string;
      step: number;
    }[];
    id: number;
    currency: {
      id: number;
      name: string;
      code: string;
      icon: string;
    };
    min_sum: number;
    max_sum: number;
  }[];
}

export interface CreditsList {
  count: number;
  next: number;
  previous: number;
  page_count: number;
  results: {
    id: number;
    slug: string;
    image: string;
    banner_image_mob: string;
    name: string;
    short_desc: string;
    is_available: boolean;
    is_creatable: boolean;
    shorts: {
      id: number;
      key: string;
      value: string;
    }[];
  }[];
}

export interface CreditOrderInfoProps {
  credits: {
    id: number;
    name: string;
    currencies: {
      id: number;
      name: string;
      code: string;
      icon: string;
    }[];
  }[];
  page: {
    id: number;
    main_title: string;
    support_phone: string;
    support_email: string;
    application_caption: string;
    personal_data_processing: {
      desc: string;
      file: string;
      id: number;
      slug: string;
      title: string;
    };
  };
}

export interface IBankBranchList {
  id: number;
  bik: number
  name: string
  address: string
}
export interface CreditOrderPropsInfo {
  is_application_enabled: boolean
  individual_credits: {
    id: number;
    name: string;
    currencies: {
      id: number;
      name: string;
      code: string;
      icon: string;
    }[];
  }[];
  legal_credits: {
    slug: string;
    id: number;
    name: string;
    currencies: {
      id: number;
      name: string;
      code: string;
      icon: string;
    }[];
  }[];
  page: {
    id: number;
    main_title: string;
    support_phone: string;
    support_email: string;
    application_caption: string;
    personal_data_processing: {
      id: number;
      title: string;
      desc: string;
      slug: string;
      file: string;
    };
  };
}
