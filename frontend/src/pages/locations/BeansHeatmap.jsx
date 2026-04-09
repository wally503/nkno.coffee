import * as React from "react";
import { getBeanCountryCount } from "../../api/beansApi";
import * as d3 from 'd3';
import * as topojson from 'topojson-client';


export default function BeansHeatmapPage(){
    const [map, setMap] = React.useState();
    const [results, setResults] = React.useState({});
    const svgRef = React.useRef(null);

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
        const projection = d3.geoNaturalEarth1();
        const path = d3.geoPath(projection);
        const countries = topojson.feature(map, map.objects.countries);

        const svg = d3.select(svgRef.current);

        svg.selectAll('path')
            .data(countries.features)
            .join('path')
            .attr('d', path)
            .attr('fill', '#444')
            .attr('stroke', '#222');
    }, [map]);

    if (!map || !results) return <div>Loading map...</div>;

    console.log(map);
    console.log(results);

    return (
        <>
            <svg ref={svgRef} width={960} height={500} />
        </>
    )
}