import * as React from "react";
import { getBeanCountryCount } from "../../../api/beansApi";
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Box, Typography } from "@mui/material";


export default function BeansHeatmapPage(){
    const [map, setMap] = React.useState();
    const [results, setResults] = React.useState({});
    const svgRef = React.useRef(null);
    const svgHoverRef = React.useRef(null);

    React.useEffect(() => {
        const load = async () => {
            const [beanResult, mapResult] = await Promise.all([
                getBeanCountryCount(),
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json())
            ]);
            // console.log(beanResult.data);
            // console.log(mapResult);
            setResults(beanResult.data);
            setMap(mapResult);
        }
        load().catch(console.error);
    }, []);

    React.useEffect(() => {
        if (!map) return;
        // Prep results for transforms
        const mappedResults = Object.fromEntries(results.map((result) =>[result.origin_country__iso_code, result.count]));
        const maxCount = Math.max(...results.map((x) => x.count));

        const projection = d3.geoNaturalEarth1();
        const path = d3.geoPath(projection);
        const countries = topojson.feature(map, map.objects.countries);
        projection.fitSize([1200, 600], countries);
        const scale = d3.scaleSequential([0, maxCount], d3.interpolateOranges);
        
        const svgTooltip = d3.select(svgHoverRef.current);
        const svg = d3.select(svgRef.current);

        svg.selectAll('path')
            .data(countries.features)
            .join('path')
            .attr('d', path)
            .attr('fill', (d) => mappedResults[d.id] ? scale(mappedResults[d.id]) : '#023011' )
            .attr('stroke', '#8d2500b4')
            .on('mouseover', (event, d) => { 
                svgTooltip.style('visibility', 'visible').text(d.properties.name + ": " + (mappedResults[d.id] ? mappedResults[d.id] : 0));
            })
            .on('mousemove', (event) => { 
                svgTooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', (event, d) => {
                svgTooltip.style('visibility', 'hidden').text('')
            });
    }, [map]);

    if (!map || !results) return <div>Loading map...</div>;

    console.log(map);
    console.log(results);

    return (
        <>
            <Typography variant="h4" sx={{ ml: 7, my: 2 }}>Beans by Country of Origin</Typography>
            <Box sx={{ display: 'flex', width: '100%', alignItems:'center', flexDirection: 'column' }}>
                <svg ref={svgRef} width={1200} height={600} style={{ background: '#0d0d6b8e' }}/>
                <div ref={svgHoverRef} style={{ position: 'absolute', visibility: 'hidden' }}/>
            </Box>

        </>
    )
}