// src/pages/maps/beans/BeansHeatmap.jsx

import * as React from "react";
import { getBeanCountryCount } from "../../../api/beansApi";
import * as d3 from 'd3';
import { Typography } from "@mui/material";
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";


export default function BeansHeatmapPage(){
    const [map, setMap] = React.useState();
    const [results, setResults] = React.useState({});

    React.useEffect(() => {
        const load = async () => {
            const [beanResult, mapResult] = await Promise.all([
                getBeanCountryCount(),
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json())
            ]);
            setResults(beanResult.data);
            setMap(mapResult);
        }
        load().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (!map) return;
    }, [map]);

    if (!map || !results) return <div>Loading map...</div>;

    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Beans by Country of Origin</Typography>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={results} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"origin_country__iso_code"}
                mapKey={"countries"}
                />
            <br/><br/>

            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Beans by Country of Origin</Typography>
            <BubblemapDisplayPage 
                mapType={map} 
                mapData={results} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"origin_country__iso_code"}
                mapKey={"countries"}
                />
        </>
    )
}