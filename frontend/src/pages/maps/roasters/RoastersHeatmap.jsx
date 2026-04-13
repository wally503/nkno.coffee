// src/pages/maps/beans/RoastersHeatmap.jsx

import * as React from "react";
import * as d3 from 'd3';
import { Typography } from "@mui/material";
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";
import { getRoasterCountryRegionCount, getRoasterCountryCount } from "../../../api/roasterApi";


export default function RoastersHeatmapPage(){
    const [worldMap, setWorldMap] = React.useState();
    const [usMap, setUsMap] = React.useState();
    const [worldData, setWorldData] = React.useState({});
    const [usData, setUsData] = React.useState({});

    React.useEffect(() => {
        const load = async () => {
            const [worldResult, usResult, worldMapResult, usMapResult] = await Promise.all([
                getRoasterCountryCount(),
                getRoasterCountryRegionCount(1), // US is Currently 1
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
                fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json())
            ]);
            setWorldData(worldResult.data);
            setUsData(usResult.data);
            setWorldMap(worldMapResult);
            setUsMap(usMapResult);
        }
        load().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (!worldMap || !usMap) return;
    }, [worldMap, usMap]);

    if (!worldMap || !usMap || !worldData || !usData) return <div>Loading map...</div>;

    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <HeatmapDisplayPage 
                mapType={worldMap} 
                mapData={worldData} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />
            
            <br/><br/>

            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <BubblemapDisplayPage 
                mapType={worldMap} 
                mapData={worldData} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />

            <br/><br/>

            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by State In US</Typography> 
            <BubblemapDisplayPage 
                mapType={usMap} 
                mapData={usData} 
                projection={d3.geoAlbersUsa()} 
                isoKey={"region__identifier_code"}
                mapKey={"states"}
                />
        </>
    )
}