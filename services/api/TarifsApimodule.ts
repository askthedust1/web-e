export interface TarifsApiProps {
  count: number;
  next: string;
  previous: string;
  page_count: number;
  results: {
    id: number;
    title: string;
    ext: string;
    file: string;
  }[];
}
