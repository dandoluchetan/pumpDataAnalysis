const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/myDatabase.db');

router.get('/', (req, res) => {
    const { startTime, endTime } = req.query;

    // Validate the startTime and endTime parameters
    if (!startTime || !endTime) {
    res.status(400).json({ error: 'Start time and end time are required.' });
    return;
    }

    const params = [startTime, endTime];
    
    // Query the database to fetch data within the specified time range
    const query =  `SELECT state, COUNT(*) AS frequency
                    FROM stateData
                    WHERE from_timestamp BETWEEN ? AND ?
                    GROUP BY state
                    ORDER BY frequency DESC;`;

    db.all(query, params, (err, rows) => {
    if (err) {
        console.error(err.message);
        res.status(500).send('Error fetching data');
        return;
    }

    const totalFrequency = rows.reduce((acc, row) => acc + row.frequency, 0);

    const formattedData = rows.map(({ state, frequency }) => ({
        state,
        value: ((frequency / totalFrequency) * 100).toFixed(2),
    }));

    res.setHeader('Content-Type', 'application/json');
    res.json(formattedData);
    });
});

module.exports = router;