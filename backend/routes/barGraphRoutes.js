const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/myDatabase.db');

// Route for fetching bar graph data
router.get('/', (req, res) => {
    let sql = "SELECT * FROM stateData ORDER BY from_timestamp ASC";
    const params = [];

    if (req.query.state !== 'All') {
        const params = req.query.state;
        sql = "SELECT * FROM stateData WHERE state = ? ORDER BY from_timestamp ASC";

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error fetching data');
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(rows);
        });
    } 
    else {
        db.all(sql, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error fetching data');
                return;
            }
            res.setHeader('Content-Type', 'application/json');
            res.json(rows);
        });
    }
});

module.exports = router;