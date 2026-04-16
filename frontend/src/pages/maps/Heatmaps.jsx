// src/pages/maps/Heatmaps.jsx
import * as React from "react";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Typography, Box, Tab } from '@mui/material';
import RoastersHeatmapPage from "./roasters/RoastersHeatmap";
import BeansHeatmapPage from "./beans/BeansHeatmap";

export default function HeatmapPage(){
    const [tabValue, setTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: "90%", maxWidth: 1400, mx: "auto" }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} aria-label="Maps by Category">
                    <Tab label="Beans" value="1" />
                    <Tab label="Roasters" value="2" />
                    <Tab label="Drinks" value="3" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    <BeansHeatmapPage />
                </TabPanel>
                <TabPanel value="2">
                    <RoastersHeatmapPage />
                </TabPanel>
                <TabPanel value="3">
                    <Typography>Drinks not implemented yet</Typography>
                </TabPanel>
            </TabContext>
            </Box>
        </>
    )
}






