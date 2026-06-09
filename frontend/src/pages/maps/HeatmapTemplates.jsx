import { Typography, Box, Tab, Divider } from "@mui/material";
import HeatmapDisplayPage from "../../components/HeatmapDisplay";
import * as d3 from 'd3';

export function HeatmapWorldMapDisplay({map, data, title, subtitle, isoKey}){
    return (
        <>
            <Box sx= {{ width: 'fit-content' }}>
                <Typography variant="h4" sx={{ ml: 1, my: 0.5 }}>{title}</Typography>
                <Typography sx={{ ml: 10, my: -.5 }}><i>{subtitle}</i></Typography>
                <Divider sx={{ ml: 7, mr: -7, mb: 3, mt: 1.5, borderColor: '#6c4e4d8e'  }}/>
            </Box>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoNaturalEarth1()} 
                isoKey={isoKey}
                mapKey={"countries"}
                fitWorld={true}
                />
        </>
    )
}

export function HeatmapUSMapDisplay({map, data, title, subtitle}){
    return (
        <>
            <Box sx= {{ width: 'fit-content' }}>
                <Typography variant="h4" sx={{ ml: 1, my: 0.5 }}>{title}</Typography>
                <Typography sx={{ ml: 10, my: -.5 }}><i>{subtitle}</i></Typography>
                <Divider sx={{ ml: 7, mr: -7, mb: 3, mt: 1.5, borderColor: '#6c4e4d8e'  }}/>
            </Box>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoAlbersUsa()} 
                isoKey={"region__identifier_code"}
                mapKey={"states"}
                fitWorld={true}
                />
        </>
    )
}

export function HeatmapMercatorMapDisplay({map, data, scale, longetude, latitude, title, subtitle, isoKey}){
    return (
        <>
            <Box sx= {{ width: 'fit-content' }}>
                <Typography variant="h4" sx={{ ml: 1, my: 0.5 }}>{title}</Typography>
                <Typography sx={{ ml: 10, my: -.5 }}><i>{subtitle}</i></Typography>
                <Divider sx={{ ml: 7, mr: -7, mb: 3, mt: 1.5, borderColor: '#6c4e4d8e'  }}/>
            </Box>
            <HeatmapDisplayPage 
                mapType={map} 
                mapData={data} 
                projection={d3.geoMercator().center([longetude, latitude]).scale(scale)} 
                isoKey={isoKey}
                mapKey={"countries"}
                fitWorld={false}
                />
        </>
    )
}