// HomePage.js
import React, { useState } from 'react';
import BarGraph from './BarGraph';
import PieChart from './PieChart';
import LinearGraph from './LinearGraph';

const HomePage = () => {
    const [chartType, setChartType] = useState('PieChart');
    const [chartDescription, setChartDescription] = useState('');

    const handleChartSelection = (type) => {
        setChartType(type);
        updateChartDescription(type);
    };

    const updateChartDescription = (type) => {
        switch (type) {
            case 'BarGraph':
                setChartDescription('The bar graph displays the operating load over time. You can filter the data by selecting a specific state from the dropdown menu.');
                break;
            case 'PieChart':
                setChartDescription('The pie chart shows the distribution of different states (off, on-idle, on-loaded, on-unloaded) within a selected time range. Use the start and end time inputs to specify the desired time range.');
                break;
            case 'LinearGraph':
                setChartDescription('The linear graph illustrates the state changes over time. It plots the states (off, on-unloaded, on-idle, on-loaded) on the y-axis against the time on the x-axis. Use the start and end time inputs to specify the desired time range.');
                break;
            default:
            setChartDescription('');
        }
    };

    const renderChart = () => {
        switch (chartType) {
            case 'BarGraph':
                return <BarGraph/>;
            case 'PieChart':
                return <PieChart/>;
            case 'LinearGraph':
                return <LinearGraph/>;
            default:
                return <div>Select a chart type</div>;
        }
    };

    return (
        <div>
            <div className="chart-selection-buttons">
                <button
                    className={chartType === 'BarGraph' ? 'active' : ''}
                    onClick={() => handleChartSelection('BarGraph')}
                >
                    Bar Graph
                </button>
                <button
                    className={chartType === 'PieChart' ? 'active' : ''}
                    onClick={() => handleChartSelection('PieChart')}
                >
                    Pie Chart
                </button>
                <button
                    className={chartType === 'LinearGraph' ? 'active' : ''}
                    onClick={() => handleChartSelection('LinearGraph')}
                >
                    Linear Graph
                </button>
            </div>
            {chartDescription && ( <div className="chart-description">{chartDescription}</div> )}
            <div className="chart-area">{renderChart()}</div>
        </div>
    );
};

export default HomePage;