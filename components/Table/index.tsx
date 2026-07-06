import Section from "components/Section";
import { FC } from "react";
import style from "./table.module.scss";
import Heading from "components/Heading/Heading";
import { useRouter } from "next/router";
interface Table {
  title?: string;
  data: {
    id: number
    first: string | number;
    second: string;
    third: string;
    fourh?: string
  }[];

  panels?: {
    title: string,
    titleEn: string,
    titleKg: string,
    id: number
  }[]
}
const Table: FC<Table> = ({ title, data, panels }: Table) => {
  const { locale } = useRouter()
  const _router = useRouter()

  return (
    <Section>
      <Heading title={title} />
      <div className={style.tableMobile}>
        <table className={style.table}>
          <thead>
            <tr className={style.tr}>
              {panels &&
                panels?.map((item) => {
                  if (locale === "ru") {
                    return <th key={item.id} className={`${style.th} light-16`}>
                      {item.title}
                    </th>
                  } else if (locale === "ky") {
                    return <th key={item.id} className={`${style.th} light-16`}>
                      {item.titleKg}
                    </th>

                  } else if (locale === "en") {
                    return <th key={item.id} className={`${style.th} light-16`}>
                      {item.titleEn}
                    </th>

                  } else {
                    return <th key={item.id} className={`${style.th} light-16`}>
                      {item.title}
                    </th>
                  }

                })}
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr className={style.tr} key={item.id}>
                <td className={`${style.td} light-16`}>{item.first}</td>
                <td className={`${style.td} light-16`}>{item.second}</td>
                <td className={`${style.td} light-16`}>{item.third}</td>
                {item?.fourh && <td className={`${style.td} light-16`}>{item?.fourh}</td>}
              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </Section >
  );
};

export default Table;
