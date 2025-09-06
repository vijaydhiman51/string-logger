// ============================
// 📌 Required Modules
// ============================
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const serveIndex = require('serve-index');

// ============================
// 📌 Initialize App & Config
// ============================
const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from all origins
app.use(cors());

// Ensure "uploads" folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ============================
// 📌 Multer Setup (for file uploads)
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use timestamp + original extension for unique names
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ============================
// 📌 Routes
// ============================

// ✅ Upload photo
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const host = req.get('host');      // e.g. localhost:3000 or myapp.onrender.com
  const protocol = req.protocol;     // http or https
  const fullUrl = `${protocol}://${host}`;

  res.json({
    message: 'Photo uploaded successfully!',
    filename: req.file.filename,
    url: `${fullUrl}/photos/${req.file.filename}`
  });
});

// ✅ Serve uploaded photos (static + file index view)
app.use(
  '/photos',
  express.static('uploads'),
  serveIndex('uploads', { icons: true })
);

// ✅ Download specific photo
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath); // triggers browser download
  } else {
    res.status(404).send('File not found.');
  }
});

// ✅ Delete all photos
app.delete('/delete-photos', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');

  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Unable to scan uploads folder.');

    for (const file of files) {
      fs.unlinkSync(path.join(uploadDir, file));
    }

    res.json({ message: 'All photos deleted successfully!' });
  });
});

// ============================
// 📌 Middleware for Body Parsing
// ============================
// Must come BEFORE routes using body data
app.use(express.json({ limit: '10mb' }));           // For JSON payloads
app.use(express.text({ type: '*/*', limit: '10mb' })); // For plain text
app.use(express.urlencoded({ extended: true }));   // For form-data / x-www-form-urlencoded

// ============================
// 📌 Logging System
// ============================
const logFilePath = path.join(__dirname, 'logs.txt');

// ✅ Save logs
app.post('/save', (req, res) => {
  let incomingData = req.body;

  // If JSON with "data" field, extract it
  if (incomingData && typeof incomingData === 'object' && incomingData.data) {
    incomingData = incomingData.data;
  }

  const finalString = String(incomingData);

  if (!finalString.trim()) {
    return res.status(400).send('No data provided');
  }

  // Append log to file
  fs.appendFileSync(logFilePath, finalString + '\n');
  res.send('Data saved successfully');
});

// ✅ View logs in browser
app.get('/logs', (req, res) => {
  if (fs.existsSync(logFilePath)) {
    res.sendFile(logFilePath);
  } else {
    res.send('No logs found');
  }
});

// ✅ Download logs as file
app.get('/download', (req, res) => {
  if (fs.existsSync(logFilePath)) {
    res.download(logFilePath, 'logs.txt');
  } else {
    res.status(404).send('No logs found.');
  }
});

// ✅ Delete logs (clear file content)
app.delete('/del', (req, res) => {
  if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ''); // Empty the file
    res.send('All logs deleted successfully');
  } else {
    res.send('No logs found to delete');
  }
});

// ============================
// 📌 Start Server
// ============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
