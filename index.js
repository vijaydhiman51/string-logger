const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins
app.use(cors());

// ✅ Add all possible body parsers BEFORE routes
app.use(express.json({ limit: '10mb' })); // For JSON
app.use(express.text({ type: '*/*', limit: '10mb' })); // For plain text
app.use(express.urlencoded({ extended: true })); // For form-data / x-www-form-urlencoded

// Path for saving logs
const logFilePath = path.join(__dirname, 'logs.txt');

// POST endpoint to save data
app.post('/save', (req, res) => {
    // This will catch JSON, text, or form data
    let incomingData = req.body;

    // If JSON with "data" field, extract it
    if (incomingData && typeof incomingData === 'object' && incomingData.data) {
        incomingData = incomingData.data;
    }

    // Convert to string
    const finalString = String(incomingData);

    if (!finalString.trim()) {
        return res.status(400).send('No data provided');
    }

    // Save to file
    fs.appendFileSync(logFilePath, finalString + '\n');
    res.send('Data saved successfully');
});

// View logs
app.get('/logs', (req, res) => {
    if (fs.existsSync(logFilePath)) {
        res.sendFile(logFilePath);
    } else {
        res.send('No logs found');
    }
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'logs.txt');
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'logs.txt');
    } else {
        res.status(404).send('No logs found.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
