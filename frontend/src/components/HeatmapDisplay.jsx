// src/components/HeatmapDisplay.jsx

import { useState, useEffect, useRef } from "react";
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Box, Skeleton } from "@mui/material";
import '../App.css';

export default function HeatmapDisplayPage({ mapType, mapData, projection, isoKey, mapKey, fitWorld=false }){
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
        const mappeddata = Object.fromEntries(data.map((result) =>[result[isoKey], result.count]));
        const maxCount = Math.max(...data.map((x) => x.count));
        // const maxCount = d3.quantile(data.map(x => x.count).sort(d3.ascending), 0.85);
        
        const path = d3.geoPath(projection);
        const mapFeatures = topojson.feature(map, map.objects[mapKey]);
        if (fitWorld) {
            projection.fitSize([1200, 600], mapFeatures);
        }
        // const scale = d3.scaleSequential([0, maxCount], d3.interpolateOrRd);
        const scale = d3.scaleSequential([0, Math.sqrt(maxCount)], d3.interpolateOrRd);
        
        const svgTooltip = d3.select(svgHoverRef.current);
        const svg = d3.select(svgRef.current);

        svg.selectAll('path')
            .data(mapFeatures.features)
            .join('path')
            .attr('d', path)
            .attr('fill', (d) => mappeddata[d.id] ? scale(mappeddata[d.id]) : '#1a3a1a' )
            .attr('stroke', '#6b5a3a')
            .on('mouseover', (event, d) => { 
                svgTooltip.style('visibility', 'visible').text(d.properties.name + ": " + (mappeddata[d.id] ? mappeddata[d.id] : 0));
            })
            .on('mousemove', (event) => { 
                svgTooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px')
                    .style('background', 'rgba(30, 30, 30, 0.85)')
                    .style('color', '#f0e6d3')
                    .style('padding', '6px 10px')
                    .style('border-radius', '6px')
                    .style('font-size', '14px')
            })
            .on('mouseout', (event, d) => {
                svgTooltip.style('visibility', 'hidden').text('')
            });
    }, [map, data]);

    if (!map || !data) return (
        <>
            <Box className="heatmap-box" sx={{ borderColor: 'primary.main' }}>
                <Skeleton variant="rectangular" width="100%" height={600} />
            </Box>
        </>
    );

    return (
        <>
            <Box className="heatmap-box" sx={{ borderColor: 'primary.main' }}>
                <svg ref={svgRef} viewBox="0 0 1200 600" width='100%' style={{ background: '#0e22958e' }}/>
                <div ref={svgHoverRef} style={{ position: 'absolute', visibility: 'hidden' }}/>
            </Box>

        </>
    )
}