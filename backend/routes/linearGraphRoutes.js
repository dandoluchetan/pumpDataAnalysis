const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/myDatabase.db');

// API endpoint for fetching data for the linear graph
router.get('/', (req, res) => {
    const { startTime, endTime } = req.query;

    // Validate the startTime and endTime parameters
    if (!startTime || !endTime) {
        res.status(400).json({ error: 'Start time and end time are required.' });
        return;
    }

    const params = [startTime, endTime];

    // Query the database to fetch data within the specified time range
    const query = `SELECT from_timestamp, state
                   FROM stateData
                   WHERE from_timestamp BETWEEN ? AND ?
                   ORDER BY from_timestamp ASC`;

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(rows);
    });
});

module.exports = router;