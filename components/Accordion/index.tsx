import Section from "components/Section";
import Container from "components/Container";
import Heading from "components/Heading/Heading";
import AccordionItem from "components/AccordionItem";
import Head from "next/head";
import { FC } from "react";
interface AccardionItems {
  id: number,
  question: string,
  answer: string;
}
interface AccordionProps {
  title?: string;
  accardion?: AccardionItems[];

}

const Accordion: FC<AccordionProps> = ({ title, accardion }: AccordionProps) => {
  const faqSchema = accardion?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: accardion.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  return (
    <Section>
      {faqSchema && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </Head>
      )}
      <Container>
        <Heading title={title} />
        {accardion?.map((item, index) => (
          <AccordionItem key={index} question={item.question} answer={item.answer} />
        ))}

      </Container>
    </Section>
  );
};

export default Accordion;
