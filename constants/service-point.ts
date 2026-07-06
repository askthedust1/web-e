// export const SERVICE_POINT = [
//   {
//     name: "Отделения",
//     id: 1,
//     key: "branches",
//     locale: "branches",
//   },
//   {
//     name: "Банкоматы",
//     id: 3,
//     key: "bankomats",
//     locale: "bankomats",
//   },
//   {
//     name: "POS-терминалы",
//     id: 2,
//     key: "pos_terminals",
//     locale: "pos_terminals",
//   },
//   {
//     name: "Устройства по приему платежей",
//     id: 4,
//     key: "payment_points",
//     locale: "payment_points",
//   },
// ];

export const SERVICE_POINT = [
  {
    name: 'Отделения',
    id: 'branches',
    key: 'branches',
    locale: 'branches',
  },
  {
    name: 'Банкоматы',
    id: 'bankomats',
    key: 'bankomats',
    locale: 'bankomats',
  },
  // {
  //   name: "POS-терминалы",
  //   id: "pos_terminals",
  //   key: "pos_terminals",
  //   locale: "pos_terminals",
  // },
  // {
  //   name: 'Устройства по приему платежей',
  //   id: 'payment_points',
  //   key: 'payment_points',
  //   locale: 'payment_points',
  // },
]
export const TIME_OPTIONS = [
  {
    name: 'Стаднатный режим',
    id: 1,
    locale: 'Now',
  },
  // {
  //   name: 'Круглосуточно',
  //   id: 2,
  //   locale: 'day_nigth',
  // },
  {
    name: 'Продленный режим',
    id: 3,
    locale: 'under_time',
  },
]
export const TYPE_OPTIONS = [
  {
    name: 'Филиал',
    id: 'branch',
    locale: 'filials',
  },
  {
    name: 'Сберегательная касса',
    id: 'savings_office',
    locale: 'savings',
  },
  {
    name: 'Выездная касса',
    id: 'field_office',
    locale: 'mobile-cash',
  },
  {
    name: "Другое",
    id: 'other',
    locale: 'cok',
  },
]

export const BANKOMATS_TYPE = [
  {
    name: 'АТМ',
    id: 'ATM',
    locale: 'ATM',
  },
  {
    name: 'ПВН',
    id: 'PVN',
    locale: 'PVN',
  },
]


export enum ServicePointsEnum {
  AllService = 0,
  Branches = 1,
  PostTerminal = 2,
  Bankomats = 3,
  PaymentDevices = 4,
}
