export interface CalculatorDepozitProps {
  deposits: {
    id: 1;
    slug: string;
    name: string;
    calc_currencies: {
      calc_percents: {
        id: number;
        period: {
          id: number;
          measure: string;
          start: number;
          end: number;
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
  }[];
  calc_caption: string;
}
export interface CalculatorCreditProps {
  credits: {
    id: 1;
    slug: string;
    name: string;

    calc_currencies: {
      calc_percents: {
        id: number;
        period: {
          id: number;
          measure: string;
          start: number;
          end: number;
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
  }[];
  calc_caption: string;
}

export interface TableProps {
  results: {
    month: 1;
    main_rest: string;
    main_debt: string;
    added_perc: string;
    pay: string;
  }[];
  added_full_perc: string;
  perc: string;
  added_one_perc: string;
}
