export interface IdentificationProps {
  page: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    og_title: string;
    og_image: string;
    og_description: string;
    banner_title: string;
    banner_subtitle: string;
    banner_button_text: string;
    banner_button_link: string;
    banner_image: string;
    banner_image_mob: string;
    id: number;
    main_title: string;
    main_desc: string;
    support_phone: number;
    support_email: string;
    application_caption: string;
    personal_data_processing: {
      id: number;
      title: string;
      desc: string;
      slug: string;
      file: string 
    };
  };
  regions: {
    id: 3;
    name: string;
    districts: {
      id: number;
      name: string;
      cities: {
        id: number;
        name: string;
      }[];
    }[];
  }[];
  countries: {
    id: number;
    name: string;
  }[];
  seria_versions: {
    id: number;
    name: string;
  }[];
  organs: {
    id: number;
    name: string;
  }[];
  purposes: [
    {
      id: number;
      name: string;
    }
  ];
  branches: {
    id: number;
    slug: string;
    name: string;
    address: string;
  }[];
  cards: {
    id: number;
    slug: string;
    name: string;
    currencies: {
      id: number;
      name: string;
      code: string;
      icon: string;
    }[];
  }[];
}
