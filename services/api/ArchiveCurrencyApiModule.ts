export interface ArchiveCurrencyApiModule {
  id: number
  created_at: string
  caption: string
  bottom_caption: string
  cash_exchanges: {
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    buy: string
    sell: string
    commission: string
    nbkr: string
  }[]
  cashless_exchanges: {
    id: number
    currency: {
      id: number
      name: string
      code: string
      icon: string
    }
    buy: string
    sell: string
    commission: string
    nbkr: string
  }[]
  gold_exchanges: {
    id: number
    weight: string
    buy: string
    sell: string
  }[]
}

interface Checkbox {
  id: number
  text: string
}

export interface SurveyQuestion {
  id: number
  title: string
  has_checkboxes: boolean
  checkboxes: Checkbox[]
}
