// src/pages/maps/beans/BeansHeatmap.jsx

import * as React from "react";
import { getBeanCountryCount } from "../../../api/beansApi";
import * as d3 from 'd3';
import { Typography, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";


export default function BeansHeatmapPage(){
    const [map, setMap] = React.useState();
    const [results, setResults] = React.useState({});
    const [tabValue, setTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
            <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto"}}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="World Bubblemap" value="1" />
                        <Tab label="World Heatmap" value="2" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <BubbleMapWorldMapDisplay map={map} data={results} />
                    </TabPanel>
                    <TabPanel value="2">
                        <HeatmapWorldMapDisplay map={map} data={results} />
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}


function BubbleMapWorldMapDisplay({map, data}){
    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Beans by Country of Origin</Typography>
            <BubblemapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"origin_country__iso_code"}
                mapKey={"countries"}
                />
        </>
    )
}

function HeatmapWorldMapDisplay({map, data}){
    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Beans by Country of Origin</Typography>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={"origin_country__iso_code"}
                mapKey={"countries"}
                />
        </>
    )
}