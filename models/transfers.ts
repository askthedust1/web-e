export type Transfers = {
  id: number;
  advantages: Array<dataAdventuresItem>;
  banner_button_link: string;
  banner_button_text: string;
  banner_image: string;
  banner_image_mob: string;
  banner_subtitle: string;
  banner_title: string;

  main_body: string;
  main_body2: string;
  main_body3: string;
  main_body_caption: string;
  main_title: string;
  main_title2: string;
  main_title3: string;
  og_description: string;
  og_image: string;
  og_title: string;
  red_caption: string;
  seo_description: string;
  seo_keywords: string;
  seo_title: string;
  transfer_systems: Array<dataTransferSystemsItem>;
};
interface dataAdventuresItem {
  id: number;
  title: string;
  icon: string;
}

interface dataTransferSystemsItem {
  id: number;
  name: string;
}
