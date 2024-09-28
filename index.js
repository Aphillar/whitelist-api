const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Importing the sqlite3 library

const app = express();
app.use(express.json()); // for parsing JSON request body

// Connect to the SQLite database
const db = new sqlite3.Database('./whitelistDB.sqlite', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// API endpoint for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the Whitelist API! Use /v1/check to check whitelist status.');
});

// API endpoint to handle whitelist requests
app.get('/v1/check', (req, res) => {
    const { hubID, productID, robloxID } = req.query;

    // Check for missing parameters
    if (!hubID || !productID || !robloxID) {
        return res.status(400).json({
            status: "400",
            message: "Missing parameters",
        });
    }

    // Query the database for whitelist information
    const query = `SELECT * FROM whitelist WHERE robloxID = ? AND productID = ? AND hubID = ?`;
    db.get(query, [robloxID, productID, hubID], (error, row) => {
        if (error) {
            return res.status(500).json({
                status: "500",
                message: "Database error",
            });
        }

        // If whitelist entry is found, return status 200
        if (row) {
            res.json({
                status: "200",
                message: "whitelist approved",
                details: {
                    robloxID: row.robloxID,
                    product: row.productID,
                    owned: row.owned === 1, // Convert to boolean
                }
            });
        } else {
            // If no whitelist entry is found, return status 104
            res.status(404).json({
                status: "104",
                message: "No whitelist found",
                details: {
                    robloxID: parseInt(robloxID),
                    product: productID,
                    owned: false,
                }
            });
        }
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Close the database connection on application exit
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database: ' + err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});