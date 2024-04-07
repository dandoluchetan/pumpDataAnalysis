import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LinearGraph = () => {
    const svgRef = useRef(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [chartData, setChartData] = useState([]);

    const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    };

    const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:5000/api/linear-graph?startTime=${startTime}&endTime=${endTime}`);
        const data = await response.json();
        setChartData(data);
    };

    useEffect(() => {
    if (chartData.length > 0) {
            const width = 1000;
            const height = 600;
            const margin = { top: 20, right: 20, bottom: 120, left: 80 };
            
            d3.select('#linear-graph').selectAll('*').remove();

            const svg = d3
                .select('#linear-graph')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            svgRef.current = svg;

            const x = d3.scaleTime()
                .domain(d3.extent(chartData, d => new Date(d.from_timestamp)))
                .range([0, width]);

            const y = d3.scalePoint()
                .domain(['off', 'On - unloaded', 'On - Idle', 'On - loaded'])
                .range([height, 0]);

            const duration = x.domain()[1] - x.domain()[0];
            const tickInterval = duration <= 3600000 ? 600000 : 3600000;
            
            const xAxis = d3.axisBottom(x)
                .tickFormat(d => {
                    if (isNaN(Date.parse(d))) {
                        return 'NaN';
                    }
                    return d3.utcFormat('%m-%d %H:%M')(new Date(d));
                })
                .tickValues(x.ticks(d3.timeMinute.every(tickInterval / 60000)));

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-45)")
                .style("text-anchor", "end");

            svg.append('g')
                .call(d3.axisLeft(y));

            const line = d3.line()
                .x(d => x(new Date(d.from_timestamp)))
                .y(d => y(d.state));

            svg.append('path')
                .datum(chartData)
                .attr('fill', 'none')
                .attr('stroke', 'steelblue')
                .attr('stroke-width', 1.5)
                .attr('d', line);

            svg.selectAll('.dot')
                .data(chartData)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => x(new Date(d.from_timestamp)))
                .attr('cy', d => y(d.state))
                .attr('r', 3)
                .style('fill', 'steelblue');

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
                .text("Machine State");
    }
    }, [chartData]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="start-time">Start Time:</label>
                    <input type="datetime-local" id="start-time" value={startTime} onChange={handleStartTimeChange} required />
                </div>
                <div>
                    <label htmlFor="end-time">End Time:</label>
                    <input type="datetime-local" id="end-time" value={endTime} onChange={handleEndTimeChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            <div style={{ marginTop: '20px' }}>
                <div id="linear-graph"></div>
            </div>
        </div>
    );
};

export default LinearGraph;