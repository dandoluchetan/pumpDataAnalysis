import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PieChart = () => {
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
        const response = await fetch(`http://localhost:5000/api/pie-chart?startTime=${startTime}&endTime=${endTime}`);
        const data = await response.json();
        setChartData(data);
    };

    useEffect(() => {
        if (chartData.length > 0) {
            const width = 500;
            const height = 500;

            d3.select('#pie-chart').selectAll('*').remove();

            const svg = d3
                .select('#pie-chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            svgRef.current = svg;

            const pie = d3.pie().value(d => d.value);
            const data_ready = pie(Object.values(chartData));

            const radius = Math.min(width, height) / 2.5;

            const arc = d3
                .arc()
                .innerRadius(0)
                .outerRadius(radius);

            const arcs = svg
                .selectAll('arc')
                .data(data_ready)
                .enter()
                .append('g')
                .attr('class', 'arc');

            arcs
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => d3.schemeSet3[i])
                .style('stroke', 'black')
                .style('stroke-width', '1px');

            // Add the legend below the pie chart
            const legendGroup = svg
                .append('g')
                .attr('transform', `translate(-250, ${radius + 20})`); 

            // Adjust the spacing between legend items
            const legend = legendGroup
                .selectAll('.legend')
                .data(data_ready)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', (d, i) => `translate(${i * 200}, 0)`); 

            legend
                .append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 18)
                .attr('height', 18)
                .attr('fill', (d, i) => d3.schemeSet3[i]);

            legend
                .append('text')
                .attr('x', 24)
                .attr('y', 9)
                .attr('dy', '0.35em')
                .text(d => {
                    const value = typeof d.data.value === 'number' ? d.data.value : parseFloat(d.data.value);
                    return `${d.data.state} (${value.toFixed(2)}%)`;
                });
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
                <div id="pie-chart"></div>
            </div>
        </div>
    );
};

export default PieChart;