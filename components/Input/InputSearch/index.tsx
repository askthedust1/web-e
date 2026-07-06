import Icon from "components/Icon";
import React from "react";
import style from "./Input.module.scss";

interface Input {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  placeholder?: string;
  value?: string;
  className: string
}

const InputSearch: React.FC<Input> = ({ onChange, value, placeholder, className }: Input) => {
  return (
    <div className={`${style.div} ${className}`}>
      <input

        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="search"
        id="search"
        className={style.input}
      />
      <Icon id="search" className={style.icon} width={20} height={18} />
    </div>
  );
};

export default InputSearch;
