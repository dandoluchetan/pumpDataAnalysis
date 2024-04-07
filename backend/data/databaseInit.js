const sqlite3=require('sqlite3').verbose();

// Connect to the SQLite database
let db=new sqlite3.Database('./data/myDatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(err) {
        if (err) {
            console.error('Error when creating the database', err);
        } else {
            console.log('Database created!');
            /* Database schema creation */
            createTable();
        }
    });

function createTable() {
    // SQL statement to create a table
    const sqlCreateTable=`
        CREATE TABLE IF NOT EXISTS stateData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_timestamp DATETIME NOT NULL,
            psum_avg_value REAL,
            operating_load REAL,
            state TEXT NOT NULL
        )`;

    db.run(sqlCreateTable, function(err) {
            if (err) {
                console.error('Error creating table', err);
            } else {
                console.log('Table created or already exists.');
            }
        });
}

// Close the database connection
function closeDb() {
    db.close(function(err) {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}
