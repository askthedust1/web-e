import clsx from "clsx";
import InputSearch from "components/Input/InputSearch";
import { BANKOMATS_TYPE, SERVICE_POINT, TIME_OPTIONS, TYPE_OPTIONS } from 'constants/service-point'
import { useTranslation } from "next-i18next";
import { PointState } from "pages/points/pointsReducer";
import React, { FC } from "react";
import { Cities } from "services/api/BranchesApimodule";
import SelectFilter from "..";
import style from "./selects-grid.module.scss";
import s from 'pages/points/points.module.scss'
import Button from 'components/Buttons/Button'
interface Props {
    selectService(value: string): void;
    selectCity(value: string): void;
    cities: Cities[];
    regions: Cities[];
    searchHendler(e: string): void;
    selectTime(e: string): void;
    selectRegion(e: string): void;
    selectBranch(e: string): void;
    resetFilters(): void;
    selectType(e: string): void;
    isMobile: boolean
    filterMobile?: boolean
    values: PointState
    searchValue: string
}
const SelectsGird: FC<Props> = ({
    selectService, resetFilters,
    cities,
    selectCity,
    searchHendler,
    selectTime, selectType,
    regions,
    selectRegion, selectBranch,
    isMobile,
    filterMobile = false,
    values,
    searchValue
}) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={clsx(style.wrapper, !!isMobile && style.isMobile, filterMobile && style.toggle)} >
                <div className={style.grid}>
                    <SelectFilter
                        classNameBlock={style.first}
                        optionList={SERVICE_POINT}
                        selectOption={selectService}
                        value={values.service}
                    />
                    <SelectFilter
                        classNameBlock={style.second}
                        optionList={regions}
                        selectOption={selectRegion}
                        label={t("region")}
                        value={values.region}
                    />
                    <SelectFilter
                        classNameBlock={style.third}
                        label={t("choose_city")}
                        optionList={cities}
                        selectOption={selectCity}
                        value={values.city}
                    />
                    <SelectFilter
                        classNameBlock={style.fourh}
                        optionList={TIME_OPTIONS}
                        selectOption={selectTime}
                        label={t("time")}
                        value={values.mode}
                    />
                    {
                        values.service === 'branches'
                          ? <SelectFilter
                            classNameBlock={style.fifth}
                            optionList={TYPE_OPTIONS}
                            selectOption={selectBranch}
                            label={t('service_point_service.type')}
                            value={values.branch_type}
                          /> : <SelectFilter
                            classNameBlock={style.fifth}
                            optionList={BANKOMATS_TYPE}
                            selectOption={selectType}
                            label={t('service_point_service.type-bankomats')}
                            value={values.type}
                          />
                    }
                    <Button
                      className={s.resetButton}
                      onClick={resetFilters}
                      value={t('service_point_service.filter')}
                      isOutline
                    />
                </div>
                <div className={style.searchWrapperMob}>
                    <InputSearch
                      className={style.search}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          searchHendler(e.target.value)
                      }
                      }
                    />
                </div>
            </div>
            <div className={style.searchWrapper}>
                <InputSearch
                    value={searchValue}
                    className={style.search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        searchHendler(e.target.value)
                    }
                    }
                />
            </div>
        </>
    );
};

export default SelectsGird;