// src/pages/maps/roasters/RoastersHeatmap.jsx

import * as React from "react";
import * as d3 from 'd3';
import { Typography, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";
import { getRoasterCountryRegionCount, getRoasterCountryCount } from "../../../api/roasterApi";


export default function RoastersHeatmapPage(){
    const [worldMap, setWorldMap] = React.useState();
    const [usMap, setUsMap] = React.useState();
    const [worldData, setWorldData] = React.useState({});
    const [usData, setUsData] = React.useState({});
    const [tabValue, setTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        const load = async () => {
            const [worldResult, usResult, worldMapResult, usMapResult] = await Promise.all([
                getRoasterCountryCount(),
                getRoasterCountryRegionCount(1), // US is Currently 1
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
                fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json())
            ]);
            console.log('us data pre: ' + usResult.data);
            setWorldData(worldResult.data);
            setUsData(usResult.data);
            setWorldMap(worldMapResult);
            setUsMap(usMapResult);
            console.log('us data: ' + usData);
        }
        load().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (!worldMap || !usMap) return;
    }, [worldMap, usMap]);

    if (!worldMap || !usMap || !worldData || !usData) return <div>Loading map...</div>;

    return (
        <>
            <Box sx={{ width: "90%", maxWidth: 1400, mx: "auto" }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="United States" value="1" />
                        <Tab label="World Bubblemap" value="2" />
                        <Tab label="World Heatmap" value="3" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <BubblemapUSMapDisplay map={usMap} data={usData} />
                    </TabPanel>
                    <TabPanel value="2">
                        <BubbleMapWorldMapDisplay map={worldMap} data={worldData} />
                    </TabPanel>
                    <TabPanel value="3">
                        <HeatmapWorldMapDisplay map={worldMap} data={worldData} />
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

function BubbleMapWorldMapDisplay({map, data}){
    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <BubblemapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />
        </>
    )
}

function HeatmapWorldMapDisplay({map, data}){
    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by Country of Origin</Typography>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"country__iso_code"}
                mapKey={"countries"}
                />
        </>
    )
}

function BubblemapUSMapDisplay({map, data}){
    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Roasters by State In US</Typography> 
            <BubblemapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoAlbersUsa()} 
                isoKey={"region__identifier_code"}
                mapKey={"states"}
                />
        </>
    )
}