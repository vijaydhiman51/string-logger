# 📦 String Logger

A simple Express server for:
- Uploading and serving photos
- Downloading and deleting uploaded files
- Logging text/JSON data to a file
- Viewing, downloading, and clearing logs

---

## 🚀 Features
- Upload images using **Multer**
- Serve uploaded files at `/photos`
- Download files by filename
- Delete all uploaded photos
- Save any string/JSON data into `logs.txt`
- View logs in browser or download them
- Clear logs file

---

## 📂 Project Structure
```
string-logger/
├── index.js        # Main server code
├── package.json    # Dependencies & scripts
├── uploads/        # Uploaded photos (auto-created)
└── logs.txt        # Log file (auto-created)
```

---

## ⚙️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/string-logger.git
   cd string-logger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   or in development (auto-restart on changes):
   ```bash
   npm run dev
   ```

Server runs on **http://localhost:3000** by default.

---

## 📡 API Endpoints & Curl Examples

### 🔹 Upload Photo
```http
POST /upload
```
- **Form field name:** `photo`
- Returns file URL and filename.

**Curl Example:**
```bash
curl -X POST -F "photo=@/path/to/file.jpg" http://localhost:3000/upload
```

---

### 🔹 View Photos
```http
GET /photos
```
- Opens file browser with uploaded photos.

**Curl Example:**
```bash
curl http://localhost:3000/photos
```

---

### 🔹 Download Photo
```http
GET /download/:filename
```
- Example: `/download/1694089465234.jpg`

**Curl Example:**
```bash
curl -O http://localhost:3000/download/1694089465234.jpg
```

---

### 🔹 Delete All Photos
```http
DELETE /delete-photos
```
- Deletes everything inside `/uploads`.

**Curl Example:**
```bash
curl -X DELETE http://localhost:3000/delete-photos
```

---

### 🔹 Save Log
```http
POST /save
```
- Accepts:
  - JSON: `{ "data": "Hello World" }`
  - Plain text
  - Form data

**Curl Examples:**

➡️ Save JSON:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"data":"Hello from JSON"}' http://localhost:3000/save
```

➡️ Save Plain Text:
```bash
curl -X POST -H "Content-Type: text/plain" -d "Hello from plain text" http://localhost:3000/save
```

➡️ Save Form Data:
```bash
curl -X POST -d "data=Hello from form data" http://localhost:3000/save
```

---

### 🔹 View Logs
```http
GET /logs
```
- Displays logs directly in the browser.

**Curl Example:**
```bash
curl http://localhost:3000/logs
```

---

### 🔹 Download Logs
```http
GET /download
```
- Downloads `logs.txt`.

**Curl Example:**
```bash
curl -O http://localhost:3000/download
```

---

### 🔹 Delete Logs
```http
DELETE /del
```
- Clears all logs (empties `logs.txt`).

**Curl Example:**
```bash
curl -X DELETE http://localhost:3000/del
```

---

## 🛠️ Dependencies
- [express](https://www.npmjs.com/package/express)
- [cors](https://www.npmjs.com/package/cors)
- [multer](https://www.npmjs.com/package/multer)
- [serve-index](https://www.npmjs.com/package/serve-index)
- [nodemon](https://www.npmjs.com/package/nodemon) (dev only)

---

## 📜 License
[ISC](https://opensource.org/licenses/ISC) © VIJAY
