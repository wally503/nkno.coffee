import BeansHeatmapPage from "./maps/beans/BeansHeatmap"
import RoastersHeatmapPage from "./maps/roasters/RoastersHeatmap"

export default function MapsPage() {
    return  (
        <>
            { BeansHeatmapPage() }
            <br/>
            {RoastersHeatmapPage() }
        </>
    )
};