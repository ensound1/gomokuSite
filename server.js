const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Environment variables for security
require('dotenv').config();
const uri = process.env.MONGODB_URI;


// Create a new MongoClient
const client = new MongoClient(uri);

app.use(express.json()); // Middleware to parse JSON bodies

async function connectDB() {
    client.connect().catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
}

app.use(express.static('public'));
app.use('/Models', express.static('Models'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to fetch user stats
app.get('/stats', async (req, res) => {
    try {
        const database = client.db('GomokuStats');
        const collection = database.collection('userStats');
        const stats = await collection.find({}).toArray();
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    }
});

// Route to update user stats
app.post('/updateStats', async (req, res) => {
    const { username, win } = req.body;
    try {
        const database = client.db('GomokuStats');
        const collection = database.collection('userStats');
        const result = await collection.updateOne(
            { username: username },
            { $inc: { totalGames: 1, wins: win ? 1 : 0 } },
            { upsert: true }
        );
        res.json({ message: 'Stats updated', result: result });
    } catch (error) {
        console.error('Failed to update stats:', error);
        res.status(500).send({ message: 'Failed to update stats', error: error });
    }
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
