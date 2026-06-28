// src/pages/maps/beans/BeansHeatmap.jsx

import * as React from "react";
import { getBeanCountryCount } from "../../../api/beansApi";
import * as d3 from 'd3';
import { Typography, Box, Tab, Divider, backdropClasses, Skeleton } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HeatmapDisplayPage from "../../../components/HeatmapDisplay";
import BubblemapDisplayPage from "../../../components/BubblemapDisplay";
import {HeatmapUSMapDisplay, HeatmapMercatorMapDisplay, HeatmapWorldMapDisplay}  from "../HeatmapTemplates";
import { getZoneData } from "../../../api/mapZoneApi";
import '../../../App.css';

export default function BeansHeatmapPage(){
    const [map, setMap] = React.useState();
    const [tabValue, setTabValue] = React.useState("1");
    const [results, setResults] = React.useState({});
    const [zoneGroups, setZoneGroups] = React.useState({});
    const [americasResults, setAmericasResults] = React.useState({});
    const [africaResults, setAfricaResults] = React.useState({});
    const [asiaResults, setAsiaResults] = React.useState({});
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        const load = async () => {
            const [beanResult, mapResult, zoneGroupResult] = await Promise.all([
                getBeanCountryCount(),
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
                getZoneData()
            ]);
            setResults(beanResult.data);
            setMap(mapResult);
            arrangeZoneGroupsData(zoneGroupResult, beanResult);
        }
        load().catch(console.error);
    }, []);

    function arrangeZoneGroupsData(zoneGroups, results){
        if (zoneGroups && results){
            let asiaIsos = zoneGroups.find(r => r.zone_name === "Asia Pacific").countries;
            setAsiaResults(results.data.filter(r => asiaIsos.includes(r.origin_country__iso_code)))
            let africaIsos = zoneGroups.find(r => r.zone_name === "Africa").countries;
            setAfricaResults(results.data.filter(r => africaIsos.includes(r.origin_country__iso_code)))
            let americasIsos = zoneGroups.find(r => r.zone_name === "Americas").countries;
            setAmericasResults(results.data.filter(r => americasIsos.includes(r.origin_country__iso_code)))
        }
    }

    React.useEffect(() => {
        if (!map) return;
    }, [map]);

    if (!map || !results) return (
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
                        <HeatmapMercatorMapDisplay map={map} data={americasResults} title="Beans by Location" 
                            subtitle="in the Americas" longetude={-85} latitude={5} scale={490} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                    <TabPanel value="3">
                        <HeatmapMercatorMapDisplay map={map} data={africaResults} title="Beans by Location" 
                            subtitle="in Africa" longetude={10} latitude={15} scale={550} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                    <TabPanel value="4">
                        <HeatmapMercatorMapDisplay map={map} data={asiaResults} title="Beans by Location" 
                            subtitle="in Asia Pacific" longetude={115} latitude={15} scale={500} isoKey="origin_country__iso_code"/>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}