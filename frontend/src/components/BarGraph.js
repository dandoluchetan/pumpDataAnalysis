import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarGraph = () => {
    const svgRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState('All');

    useEffect(() => {
        const fetchAndDrawBarGraph = async () => {
            //API call to get filter based response
            const response = await fetch(`http://localhost:5000/api/bar-graph?state=${selectedFilter}`);
            const data = await response.json();
            
            //API call to get all data response
            const allDataResponse = await fetch('http://localhost:5000/api/bar-graph?state=All');
            const allData = await allDataResponse.json();

            const minTimestamp = d3.min(allData, d => new Date(d.from_timestamp));
            const maxTimestamp = d3.max(allData, d => new Date(d.from_timestamp));

            const margin = { top: 20, right: 20, bottom: 120, left: 80 },
                width = 1000 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            d3.select("#bar-graph").selectAll("*").remove();

            const svg = d3.select("#bar-graph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .call(d3.zoom().on("zoom", zoomed))
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svgRef.current = svg;

            const x = d3.scaleTime()
                .domain([minTimestamp, maxTimestamp])
                .range([0, width]);

            const xAxis = d3.axisBottom(x)
                .tickFormat(d => {
                if (isNaN(Date.parse(d))) {
                    return 'NaN';
                }
                return d3.utcFormat('%m-%d %H:%M')(d);
                })
                .ticks(25);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-45)")
                .style("text-anchor", "end");

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d.operating_load)])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            const stateColorScale = d3.scaleOrdinal()
                .domain(["off", "On - Idle", "On - loaded", "On - unloaded"])
                .range(["black", "green", "darkred", "yellow"]);

            svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => x(new Date(d.from_timestamp)))
                .attr("y", d => y(d.operating_load))
                .attr("width", width / allData.length)
                .attr("height", d => height - y(d.operating_load))
                .attr("fill", d => stateColorScale(d.state));

            // Add x-axis name
            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .text("Time");

            // Add y-axis name
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .text("Operating Load");

            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - 150}, 10)`);

            const legendItems = legend.selectAll(".legend-item")
                .data(stateColorScale.domain())
                .enter()
                .append("g")
                .attr("class", "legend-item")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`);

            legendItems.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", d => stateColorScale(d));

            legendItems.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d);
            
            //Helps in zooming the graph
            function zoomed(event) {
                const { transform } = event;
                svg.attr("transform", transform);
                svg.selectAll(".bar")
                .attr("width", (width / allData.length) / transform.k)
                .attr("x", d => x(new Date(d.from_timestamp)) - ((width / allData.length) / transform.k) / 2);
                svg.selectAll(".tick text")
                .attr("transform", `translate(-10,10)rotate(-45)scale(${1 / transform.k})`);
            }
        };

        //fetchDrawBarGraph is called whenver selectedFilter is changed
        fetchAndDrawBarGraph();
    }, [selectedFilter]);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    return (
        <div>
            <div>
                <label htmlFor="filterSelect">Filter by state:</label>
                <select id="filterSelect" value={selectedFilter} onChange={handleFilterChange}>
                <option value="All">All</option>
                <option value="off">Off</option>
                <option value="On - Idle">On - Idle</option>
                <option value="On - loaded">On - Loaded</option>
                <option value="On - unloaded">On - Unloaded</option>
                </select>
            </div>
        <div id="bar-graph"></div>
        </div>
    );
};

export default BarGraph;