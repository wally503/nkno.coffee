// src/pages/maps/beans/BeansHeatmap.jsx

import * as React from "react";
import { getBeanCountryCount } from "../../../api/beansApi";
import * as d3 from 'd3';
import { Typography, Box, Tab, Divider, backdropClasses } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";
import {HeatmapUSMapDisplay, HeatmapMercatorMapDisplay, HeatmapWorldMapDisplay}  from "../HeatmapTemplates";

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
            <Box sx={{ width: "90%", maxWidth: 1400, mx: "auto"}}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="World" value="1" />
                        <Tab label="Americas" value="2" />
                        <Tab label="Africa" value="3" />
                        <Tab label="Asia Pacific" value="4" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <HeatmapWorldMapDisplay map={map} data={results} title="Beans by Location" subtitle="in the World" isoKey="origin_country__iso_code"/>
                    </TabPanel>
                    <TabPanel value="2">
                        <HeatmapMercatorMapDisplay map={map} data={results} title="Beans by Location" 
                            subtitle="in the Americas" longetude={-95} latitude={15} scale={550} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                    <TabPanel value="3">
                        <HeatmapMercatorMapDisplay map={map} data={results} title="Beans by Location" 
                            subtitle="in Africa" longetude={10} latitude={15} scale={550} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                    <TabPanel value="4">
                        <HeatmapMercatorMapDisplay map={map} data={results} title="Beans by Location" 
                            subtitle="in Asia Pacific" longetude={115} latitude={15} scale={500} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}