import { GetServerSideProps } from "next";
import ExpertAssessmentSlug from "./[slug]/index.page";
import { format } from 'date-fns'
import { ArchiveCurrencyApi } from "services/api/ArchiveCurrencyApi";
import { getTranslations } from 'helpers/serverTranslations';
import { SurveyQuestion } from "services/api/ArchiveCurrencyApiModule";
import { FC } from "react";
interface Props {
  data?: SurveyQuestion[]
  branchesGet?: any
}
const ExpertAssessment:FC<Props> = ({data}) => {
  return <ExpertAssessmentSlug data={data}/>
}

export default ExpertAssessment;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const type: any = query
  const lang: any = locale
  const date2 = (type.date || format(new Date(), 'yyyy-MM-dd')) as string
  const chech: any =
    type?.date?.length !== 0 ? { date: date2 } : { date: type.date }
  const { data } = await ArchiveCurrencyApi.getCustomerQuestions(lang)
  
  return {
    props: {
      data: data || [],
      chech,
      ...(await getTranslations(lang)),
    },
  }
}
