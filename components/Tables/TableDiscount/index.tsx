import Section from "components/Section";
import React, { FC } from "react";
import Heading from "components/Heading/Heading";
import style from "./table-discount.module.scss";
interface TableDiscountProps {
  title?: string;
  data: {
    id: number;
    condition: string;
    tariff: string;
  }[];
}

const TableDiscount: FC<TableDiscountProps> = ({
  title,
  data,
}: TableDiscountProps) => {
  const ths = ["Наименование", "Скидка", "Адрес"];
  return (
    <Section>
      <Heading title={title} />
      <table className={style.table}>
        <thead>
          <tr className={style.tr}>
            {ths.map((item) => (
              <th key={item} className={`${style.th} light-16`}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item) => (
              <tr className={style.tr} key={item.id}>
                <td className={`${style.td} light-16`}>{item.condition}</td>
                <td className={`${style.td} light-16`}>{item.tariff}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Section>
  );
};

export default TableDiscount;
