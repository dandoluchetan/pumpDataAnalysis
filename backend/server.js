const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

// Import route modules
const barGraphRoutes = require('./routes/barGraphRoutes');
const pieChartRoutes = require('./routes/pieChartRoutes');
const linearGraphRoutes = require('./routes/linearGraphRoutes');

app.use(cors());

// Use route modules
app.use('/api/bar-graph', barGraphRoutes);
app.use('/api/pie-chart', pieChartRoutes);
app.use('/api/linear-graph', linearGraphRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});