// src/pages/maps/roasters/RoastersHeatmap.jsx

import * as React from "react";
import { Typography, Box, Tab, Divider, Skeleton } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getRoasterCountryRegionCount, getRoasterCountryCount } from "../../../api/roasterApi";
import {HeatmapUSMapDisplay, HeatmapMercatorMapDisplay, HeatmapWorldMapDisplay}  from "../HeatmapTemplates";
import '../../../App.css';

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

    if (!worldMap || !usMap || !worldData || !usData) return (
        <>
            <Box className="map-container">
                <Skeleton variant="rectangular" width="100%" height={500} sx={{ bgcolor: 'background.paper' }} />
            </Box>
        </>
    );

    return (
        <>
            <Box className="map-container">
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="United States" value="1" />
                        <Tab label="World" value="2" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <HeatmapUSMapDisplay map={usMap} data={usData} title="Roasters by States" subtitle="in the United States"/>
                    </TabPanel>
                    <TabPanel value="2">
                        <HeatmapWorldMapDisplay map={worldMap} data={worldData} title="Roasters by Country" subtitle="in the World" isoKey={"country__iso_code"}/>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

