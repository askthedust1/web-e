import Icon from "components/Icon";
import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import style from "./contact-block.module.scss";

interface ContactBlockProps {
  phone_number?: string,
  email?: string;
  pos?: boolean;
}


const ContactBlock: FC<ContactBlockProps> = ({ phone_number, email, pos }: ContactBlockProps) => {
  const { t } = useTranslation()
  return (
    <div className={style.grid} style={{ background: pos ? "#007AFF !important" : "" }}>
      <div className={style.massage}>
        <h2 className="regular-20" style={{ color: pos ? "#ffff !important" : "" }}>{t("contacts.title")}</h2>
        <p className="light-16" style={{ color: pos ? "#ffff !important" : "" }}>
          {t("contacts.desc")}
        </p>
      </div>
      {
        phone_number && (
          <div className={style.contacts}>
            <div className={style.text}>
              <span className={`${style.title} light-14`}>{t("contacts.support")} </span>
              <a href={`tel:${phone_number}`} className={`${style.contact} regular-16`}>
                {phone_number || ""}
              </a>
            </div>
            <Icon id="phone" width={16} height={16} className={style.icon} />
          </div>
        )
      }
      <div className={style.contacts}>
        <div className={style.text}>
          <span className={`${style.title} light-14`}>{t("contacts.email")}</span>
          <a className={`${style.contact} regular-16`} href={`mailto: ${email}`}>
            {email || ""}
          </a>
        </div>
        <Icon id="sms" width={16} height={16} className={style.icon} />
      </div>
    </div>
  );
};

export default ContactBlock;
