// src/components/HeatmapDisplay.jsx

import { useState, useEffect, useRef } from "react";
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Box } from "@mui/material";


export default function HeatmapDisplayPage({ mapType, mapData, projection, isoKey, mapKey }){
    const [map, setMap] = useState();
    const [data, setData] = useState([]);
    const svgRef = useRef(null);
    const svgHoverRef = useRef(null);

    useEffect(() => {
        setMap(mapType);
        setData(mapData);
    }, []);

    useEffect(() => {
        if (!map || !projection || !data.length) return;
        // Prep data for transforms
        const mappeddata = Object.fromEntries(data.map((result) =>[result[isoKey], result.count]));
        const maxCount = Math.max(...data.map((x) => x.count));

        const path = d3.geoPath(projection);
        console.log('mapkey: ' + mapKey);
        const mapFeatures = topojson.feature(map, map.objects[mapKey]);
        projection.fitSize([1200, 600], mapFeatures);
        const scale = d3.scaleSequential([0, maxCount], d3.interpolateOranges);
        
        const svgTooltip = d3.select(svgHoverRef.current);
        const svg = d3.select(svgRef.current);

        svg.selectAll('path')
            .data(mapFeatures.features)
            .join('path')
            .attr('d', path)
            .attr('fill', (d) => mappeddata[d.id] ? scale(mappeddata[d.id]) : '#023011' )
            .attr('stroke', '#8d2500b4')
            .on('mouseover', (event, d) => { 
                svgTooltip.style('visibility', 'visible').text(d.properties.name + ": " + (mappeddata[d.id] ? mappeddata[d.id] : 0));
            })
            .on('mousemove', (event) => { 
                svgTooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                svgTooltip.style('visibility', 'hidden').text('')
            });
    }, [map, data]);

    if (!map || !data) return <div>Loading map...</div>;

    return (
        <>
          <Box 
                sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    alignItems:'center', 
                    flexDirection: 'column', 
                    border: '1px solid', 
                    borderRadius: '8px', 
                    borderColor: 'primary.main',
                    overflow: 'hidden' }}>
                <svg ref={svgRef} width={1200} height={600} style={{ background: '#0d0d6b8e' }}/>
                <div ref={svgHoverRef} style={{ position: 'absolute', visibility: 'hidden' }}/>
            </Box>

        </>
    )
}