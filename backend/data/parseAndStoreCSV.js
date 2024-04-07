const fs=require('fs');
const csv=require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/myDatabase.db');

const results=[];
let minTimestamp = Number.MAX_SAFE_INTEGER;
let maxTimestamp = 0;
rawData=[]

fs.createReadStream('./data/demoPumpDayData.csv')
    .pipe(csv())
    .on('data', function(row) {
        try {
            const jsonData=JSON.parse(row.metrics);
            const psum=jsonData.Psum.avgvalue;
            results.push(psum);
    
            const timestamp = parseInt(row.fromts);
            minTimestamp = Math.min(minTimestamp, timestamp);
            maxTimestamp = Math.max(maxTimestamp, timestamp);
            rawData.push({ timestamp, psum });
        } catch (error) {
            console.error('Error parsing JSON data:', error.message);
        }
    })
    .on('end', function() {
        // Sort the results array in descending order
        results.sort(function(a, b) {return b - a;});

        // Get the top 10 values
        let topTenValuesPsum=results.slice(0, 10);

        let sum=0;
        for (let i=0; i < topTenValuesPsum.length; i++) {
            sum +=topTenValuesPsum[i];
        }

        //Mean of topTenValues is psumAvg
        const psumAvg=sum / topTenValuesPsum.length;
        console.log('Top 10 Psum Values:', topTenValuesPsum);
        console.log('Psum Avg:', psumAvg);

        let allTimestamps = [];
        for (let ts = minTimestamp; ts <= maxTimestamp; ts += 60000) { // Increment by 1 minute
            allTimestamps.push(ts);
        }

        let completeData = allTimestamps.map(ts => {
            let existing = rawData.find(r => r.timestamp === ts);
            let state_name="Off";
            if (existing) {
                if(((existing.psum*100) / psumAvg)>20) {
                    state_name="On - loaded";
                }
                if(((existing.psum*100) / psumAvg)<20) {
                    state_name="On - Idle";
                }
                return {
                    from_timestamp: new Date(ts).toISOString(),
                    psum_avg_value: existing.psum,
                    operating_load: (existing.psum*100) / psumAvg,
                    state: state_name
                };
            } else {
            return {
                from_timestamp: new Date(ts).toISOString(),
                psum_avg_value: 0,
                operating_load: 0,
                state: 'off'
            };
        }
        });

        // Insert data into SQLite3 database
        completeData.forEach(function(result) {
            db.run(`INSERT INTO stateData (from_timestamp, psum_avg_value, operating_load, state) VALUES (?, ?, ?, ?)`, 
            [result.from_timestamp, result.psum_avg_value, result.operating_load, result.state], 
            function(err) {
                if (err) {
                return console.log(err.message);
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
        });

        db.close(); 
    });





