import React from "react";
import s from "./loader.module.scss";
const Loader = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.overlay}></div>
      <div className={s.loader}></div>
    </div>
  );
};

export default Loader;
