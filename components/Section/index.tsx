import React from "react";
import style from "./section.module.scss";

interface Section {
  className?: string;
  isMedium?: boolean;
  children: React.ReactNode;
}

const Section = ({ children, className, isMedium = false }: Section) => {
  return (
    <section
      className={`${style.wrapper} ${isMedium ? style.medium : ""} ${
        className ? className : ""
      }`}
    >
      {children}
    </section>
  );
};

export default Section;
