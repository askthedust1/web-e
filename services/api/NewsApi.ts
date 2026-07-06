import { serverApi } from "./apiService";
import { NewsList, NewsListDetail } from "./NewsApi.models";
interface PaginationParams {
  page: string;
  page_size?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export const NewsApi = {
  getNewsDeteil(slug: string, locale: string) {
    return serverApi.get<NewsListDetail>(`/news/${slug}`, {
      headers: {
        "Accept-Language": locale,
      },
    });
  },
  getNewsP(params: PaginationParams, locale: string) {
    return serverApi.get<NewsList>("/news", {
      params,
      headers: {
        "Accept-Language": locale,
      },
    });
  },
  getNewsSEO(locale: string) {
    return serverApi.get("/news_page", {
      headers: {
        "Accept-Language": locale,
      },
    });
  },
};
