import Link from "next/link";
import Icon from "components/Icon";
import style from "../heading.module.scss";
import { useTranslation } from "next-i18next";

interface HeadingWithNav {
    title?: string,
    link?: string,
    arrowPrev?: string,
    arrowNext?: string,
}

const HeadingWithNav = ({ title, link, arrowPrev, arrowNext }: HeadingWithNav) => {
    const { t } = useTranslation();
    return (
        <div className={style.wrapper}>
            <h2 className={`${style.title} medium-32`}>
                {title}
                {link &&
                    <Link legacyBehavior href={link}>
                        <a className={`${style.more} medium-16`}>
                            {t("setting.all")}
                            <Icon id="arrow-right" width={16} height={16} className={style.icon} />
                        </a>
                    </Link>
                }
            </h2>
            <div className={style.arrows}>
                <div className={`${style.arrow} ${arrowPrev}`}>
                    <Icon id="arrow-left" width={20} height={20} className={style.icon} />
                </div>
                <div className={`${style.arrow} ${arrowNext}`}>
                    <Icon id="arrow-right" width={20} height={20} className={style.icon} />
                </div>
            </div>
        </div>
    );
};

export default HeadingWithNav;