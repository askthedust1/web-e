import Container from "components/Container";
import { FC, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}
const Printer: FC<Props> = ({ children }) => {
  useEffect(() => {
    window.print()
    return () => {

    }
  }, [])

  return <Container>
    {children}
  </Container>;
};

export default Printer;
