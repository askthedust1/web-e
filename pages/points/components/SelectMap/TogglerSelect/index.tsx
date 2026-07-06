import Icon from "components/Icon";
import React, { FC, useState } from "react";
import s from "./toggler.module.scss";
import { useTranslation } from "next-i18next";

interface Props {
  toggle(e: boolean): void;
  currentState: boolean;
}

const Toggler: FC<Props> = ({ toggle, currentState }) => {
  const [state, setState] = useState(true);

  const { t } = useTranslation()

  const hendleToggle = () => {
    setState(!state);
    toggle(!currentState);
  };
  return (
    <>
      {state ? (
        <div className={s.open} onClick={() => hendleToggle()}>
          {t("filter")} <Icon className={s.icon} id="fillter" width={18} height={20} />

        </div>
      ) : (
        <div className={s.close} onClick={() => hendleToggle()}>
          {t("close")}
          <Icon className={s.icon} id="cross" width={13} height={16} />
        </div>
      )}
    </>
  );
};

export default Toggler;
