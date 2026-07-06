import clsx from "clsx";
import Icon from "components/Icon";
import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import { ServiceDetailProps } from "services/api/BranchesApimodule";
import s from "./card-service-point.module.scss";

interface Props {
  setDetailService: (e: null) => void;
  data: ServiceDetailProps | null;
}

const CardServicePoint: FC<Props> = ({ setDetailService, data }) => {
  const { t } = useTranslation();

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailService(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal(e);
    }
  };

  const hasAddress = data?.city?.name || data?.address;
  const hasPhones = data?.phones && data.phones.length > 0;
  const hasWorkingHours = data?.week_days && data.week_days.length > 0;

  const formatTime = (time: string) => time?.slice(0, 5) || "";

  const hasBreak = (day: any) => day?.break_from && day?.break_till;

  return (
    <div className={s.modal}>
      <div className={s.wrapperPopUp} onClick={handleOverlayClick}>
        <div className={s.cardWrapper}>
          <div className={s.card}>
            <div onClick={closeModal}>
              <Icon
                id="cross"
                width={20}
                height={20}
                className={s.iconCross}
              />
            </div>


            <div className={s.header}>
              <h2 className={clsx(s.branchName, "medium-22")}>
                {data?.name || t("no_data")}
              </h2>

              {hasAddress ? (
                <div className={s.address}>
                  <Icon id="location" width={16} height={16} />
                  <p className={clsx(s.addressText, "light-15")}>
                    {[data?.city?.name, data?.address].filter(Boolean).join(", ")}
                  </p>
                </div>
              ) : (
                <p className={clsx(s.noData, "light-15")}>
                  <Icon id="location" width={16} height={16} />
                  {t("no_address")}
                </p>
              )}

              {data?.additional_info && (
                <p className={clsx(s.additionalInfo, "light-14")}>
                  {data.additional_info}
                </p>
              )}
            </div>

            <div className={s.contacts}>
              {hasPhones ? (
                data.phones.map(phone => (
                  <div key={phone.id} className={s.phoneItem}>
                    <Icon id="phone" width={16} height={16} />
                    <a href={`tel:${phone.phone}`} className={clsx(s.phoneLink, "light-15")}>
                      {phone.phone}
                    </a>
                  </div>
                ))
              ) : (
                <div className={s.phoneItem}>
                  <Icon id="phone" width={16} height={16} />
                  <span className={clsx(s.noData, "light-15")}>{t("no_phones")}</span>
                </div>
              )}

              {data?.status && (
                <div className={s.status}>
                  <Icon id="info-circle-fill" width={16} height={16} />
                  <span className={clsx("light-14")}>
                    {data.status}
                  </span>
                </div>
              )}
            </div>

            <div className={s.section}>
              <h3 className={clsx(s.sectionTitle, "medium-18")}>{t("time_work")}</h3>

              {hasWorkingHours ? (
                <div className={s.scheduleList}>
                  {data.week_days.map((day) => (

                    <div key={day.id} className={s.scheduleItem}>
                      <div className={s.dayInfo}>
                        <span className={clsx(s.dayName, "medium-15")}>
                          {day?.day || t("no_day")}
                        </span>

                        <div className={s.workingHours}>
                          {day?.open_from && day?.open_till ? (
                            <>
                              {formatTime(day.open_from)} - {formatTime(day.open_till)}

                              {hasBreak(day) ? (
                                <div className={s.breakHours}>
                                  {t("break_time")}: {formatTime(day.break_from)} - {formatTime(day.break_till)}
                                </div>
                              ) : (
                                <div className={s.noBreak}>
                                  {t("no_break")}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className={s.noBreak}>{t("no_hours")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.noData}>
                  <Icon id="clock" width={16} height={16} />
                  <span className="light-15">{t("no_working_hours")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardServicePoint;