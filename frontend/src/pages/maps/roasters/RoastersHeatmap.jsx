// src/pages/maps/beans/RoastersHeatmap.jsx

import * as React from "react";
import * as d3 from 'd3';
import { Typography } from "@mui/material";
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";
import { getRoasterCountryCount } from "../../../api/roasterApi";


export default function RoastersHeatmapPage(){
    const [worldMap, setWorldMap] = React.useState();
    const [usMap, setUsMap] = React.useState();
    const [results, setResults] = React.useState({});

    React.useEffect(() => {
        const load = async () => {
            const [beanResult, worldMapResult, usMapResult] = await Promise.all([
                getRoasterCountryCount(),
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
                fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json())
            ]);
            setResults(beanResult.data);
            setWorldMap(worldMapResult);
            setUsMap(usMapResult);
        }
        load().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (!worldMap || !usMap) return;
    }, [worldMap, usMap]);

    if (!worldMap || !usMap || !results) return <div>Loading map...</div>;

    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <HeatmapDisplayPage 
                mapType={worldMap} 
                mapData={results} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />
            
            <br/><br/>

            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <BubblemapDisplayPage 
                mapType={worldMap} 
                mapData={results} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />

            <br/><br/>

            {/* <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by State In US</Typography> */}
            {/* <BubblemapDisplayPage 
                mapType={usMap} 
                mapData={results} 
                projection={d3.geoAlbersUsa()} 
                isoKey={"country__iso_code"}
                mapKey={"states"}
                /> */}
        </>
    )
}