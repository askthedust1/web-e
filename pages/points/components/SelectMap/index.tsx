import Container from "components/Container"
import SelectsGird from "components/Select/SelectsGird"
import { useMediaQuery } from "react-responsive";
import { FC } from "react"
import { Cities } from "services/api/BranchesApimodule";
import { PointState } from "pages/points/pointsReducer";


interface Props {
    selectService(e: string): void,
    selectCity(e: string): void,
    city: Cities[];
    regions: Cities[];
    searchHendler(e: string): void;
    selectTimeWork(e: string): void;
    selectRegion(e: string): void;
    selectType(e: string): void;
    selectBranch:(e: string) => void;
    resetFilters(): void;
    clearPoint(): void;
    values: PointState;
    filterMobile: boolean
    searchValue: string

}
const SelectMap: FC<Props> = ({selectType, resetFilters, searchValue, selectBranch, filterMobile, values, selectService, selectCity, city, searchHendler, selectTimeWork, clearPoint, regions, selectRegion }) => {

    const isMobile = useMediaQuery({ maxWidth: 640 });
    const isVisible = !!isMobile ? true : false

    return (
        <div onMouseEnter={() => clearPoint()}>
            <Container>
                {isMobile && isVisible ? (
                    <SelectsGird
                        searchValue={searchValue}
                        isMobile={isMobile}
                        selectService={selectService}
                        selectCity={selectCity}
                        cities={city}
                        resetFilters={resetFilters}
                        selectBranch={selectBranch}
                        selectType={selectType}
                        searchHendler={searchHendler}
                        selectTime={selectTimeWork}
                        regions={regions}
                        selectRegion={selectRegion}
                        values={values}
                        filterMobile={filterMobile}

                    />
                ) : (
                    (
                        <SelectsGird
                            searchValue={searchValue}
                            isMobile={isMobile}
                            selectService={selectService}
                            selectCity={selectCity}
                            selectType={selectType}
                            resetFilters={resetFilters}
                            cities={city}
                            selectBranch={selectBranch}
                            searchHendler={searchHendler}
                            selectTime={selectTimeWork}
                            regions={regions}
                            selectRegion={selectRegion}
                            values={values}



                        />
                    )
                )}
            </Container>
        </div>
    )
}

export default SelectMap