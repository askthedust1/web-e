import { FC } from "react"
import { Branches, ServiceDetailProps } from "services/api/BranchesApimodule";
import dynamic from "next/dynamic";
import Loader from 'components/Loader'

const SimpleMap = dynamic(() => import("components/Map"), { ssr: false, loading: () => <Loader/> });


interface Props {
    data: Branches[]
    setClearMap(e: string | null): void,
    getDetailInfo(slug: string): void,
    detailPoint: ServiceDetailProps | null,
    clearMap: string | null,
    clearPoint(): void,
    hoveredItemId?: number | null
    center?: [number, number]
}


const MapPoints: FC<Props> = ({ data, setClearMap, detailPoint, getDetailInfo, clearMap, clearPoint, hoveredItemId, center }) => {

    return (
        <>
            <div >
                <SimpleMap
                    clearPoint={clearPoint}
                    clearMap={clearMap}
                    getDetailInfo={getDetailInfo}
                    data={data}
                    setClearMap={setClearMap}
                    detailPoint={detailPoint}
                    hoveredItemId={hoveredItemId}
                    center={center}
                />
            </div>
        </>
    )
}

export default MapPoints