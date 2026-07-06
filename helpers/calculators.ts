import { TimeFormatEnum } from "pages/calculator/index.page";

export function calculateDeposite2(
    sum: number,
    perc: number,
    time: number,
    timeFormat: TimeFormatEnum | any
): string {
    let finalResult: number;

    switch (timeFormat) {
        case TimeFormatEnum.Day:
        case TimeFormatEnum.Month:
        case TimeFormatEnum.Year:
            finalResult = sum + (sum * (perc / 100) * time);
            break;
        default:
            throw new Error('Invalid time format');
    }
    return finalResult.toString();
}


export function calculateDeposite(
  sum: number,
  perc: number,
  month: number,
  timeFormat: string
) {
  let _finallResult;
  const monthDays = month * 30;
  const daysOfYear = 365;
  const _resultDepozit = ((sum * perc) / 100 / daysOfYear) * monthDays;
  if (timeFormat === TimeFormatEnum.Day) {
    return (_finallResult = ((sum * perc) / 100 / daysOfYear) * month).toFixed(
      2
    );
  } else if (timeFormat === TimeFormatEnum.Month) {
    return (_finallResult =
      ((sum * perc) / 100 / daysOfYear) * monthDays).toFixed(2);
  } else if (timeFormat === TimeFormatEnum.Year) {
    return (_finallResult = Math.round(sum * (1 + perc) ** month)).toFixed(2);
  }
}

export function creditsCalculator(
  duration: number,
  percent: number,
  sum: number,
  timeFormat: string
) {
  let _finallResult;
  const monthLengths = 12;
  const negMonthLengths = -12;
  const PayableYears = duration / monthLengths;
  const _PayableInYears = duration * 12;
  const monthlyInterest = (sum * (percent / 100)) / monthLengths;
  const pmt =
    monthlyInterest /
    (1 -
      Math.pow(
        1 + percent / 100 / monthLengths,
        negMonthLengths * PayableYears
      ));

  if (timeFormat === TimeFormatEnum.Day) {
    // return (finallResult = ((sum * percent) / 365) * duration).toFixed(2);
    return (_finallResult = pmt).toFixed(2);
  } else if (timeFormat === TimeFormatEnum.Month) {
    return (_finallResult = pmt).toFixed(2);
  } else if (timeFormat === TimeFormatEnum.Year) {
    return (_finallResult = pmt).toFixed(2);
    // return (finallResult =
    //   monthlyInterest /
    //   (1 -
    //     Math.pow(
    //       1 + percent / 100 / monthLengths,
    //       negMonthLengths * PayableInYears
    //     ))).toFixed(2);
  }
}

export const formatNumberWithSpaces = (value: number | string | undefined) => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? ""
}
