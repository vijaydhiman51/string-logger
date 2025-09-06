const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const serveIndex = require("serve-index");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins
app.use(cors());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});

const upload = multer({ storage: storage });

// Upload photo API
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const host = req.get("host");         // e.g. localhost:3000 OR myapp.onrender.com
  const protocol = req.protocol;        // http OR https
  const fullUrl = `${protocol}://${host}`;

  res.json({
    message: "Photo uploaded successfully!",
    filename: req.file.filename,
    url: `${fullUrl}/photos/${req.file.filename}`
  });
});

// Serve uploaded photos
app.use("/photos", express.static("uploads"), serveIndex("uploads", { icons: true }));

// Download photo API
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath); // triggers browser download
  } else {
    res.status(404).send("File not found.");
  }
});

app.delete("/delete-photos", (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send("Unable to scan uploads folder.");

    for (const file of files) {
      fs.unlinkSync(path.join(uploadDir, file));
    }

    res.json({ message: "All photos deleted successfully!" });
  });
});

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

app.delete('/del', (req, res) => {
    if (fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, ''); // Empty the file
        res.send('All logs deleted successfully');
    } else {
        res.send('No logs found to delete');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
