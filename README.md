# 🏢 Asset Inventory System - GMADC OJT Project

A complete **web-based asset inventory system** for digitizing and managing physical asset tracking using Excel uploads and QR code scanning.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### ✅ Completed Features

1. **Excel File Upload**
   - Upload `.xlsx` files with asset data
   - Automatic parsing and validation
   - Support for all 9 required columns
   - Drag-and-drop interface

2. **Smart Data Merging (Upsert)**
   - Preserve existing "ACCOUNTED" assets
   - Update incomplete records
   - Add new assets on re-upload
   - Avoid data loss on updates

3. **Camera-Based QR Scanning**
   - Mobile-friendly QR code scanner
   - Real-time asset detection
   - Automatic status updates
   - Duplicate scan prevention

4. **Real-Time Status Updates**
   - Instant table refresh after scans
   - Color-coded status indicators
   - Live statistics dashboard
   - Visual feedback for all actions

5. **Excel Download**
   - Export updated inventory
   - Color-formatted output
   - Includes all modifications
   - Timestamp in filename

6. **Search & Filter**
   - Search across multiple fields
   - Filter by status (ACCOUNTED/UNACCOUNTED/RECONCILING)
   - Sortable columns
   - Live result counting

7. **Statistics Dashboard**
   - Total asset count
   - Accounted assets (green)
   - Unaccounted assets (red)
   - Reconciling assets (yellow)

---

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend** | React 18.2 | Component-based, real-time updates |
| **Styling** | Tailwind CSS | Responsive, utility-first design |
| **Backend** | Node.js + Express | Lightweight, fast, JavaScript everywhere |
| **Storage** | JSON File + MongoDB Atlas | Inventory stays in JSON; users/auth use MongoDB Atlas |
| **Excel Processing** | XLSX + ExcelJS | Industry standard, full Excel support |
| **File Upload** | Multer | Standard Express middleware |
| **QR Scanning** | html5-qrcode | Mobile-ready, no server-side QR generation |
| **HTTP Client** | Axios | Simple, promise-based requests |

---

## 📁 Project Structure

```
inventory-system/
│
├── backend/                          # Node.js + Express API
│   ├── server.js                     # Main server entry point
│   ├── package.json                  # Backend dependencies
│   │
│   ├── routes/                       # API endpoints
│   │   ├── upload.js                 # POST /api/upload
│   │   ├── scan.js                   # POST /api/scan
│   │   ├── download.js               # GET /api/download
│   │   └── assets.js                 # GET /api/assets
│   │
│   ├── middleware/
│   │   └── uploadConfig.js           # Multer configuration
│   │
│   ├── db/
│   │   ├── database.js               # JSON-based data storage
│   │   ├── mongoose.js               # MongoDB Atlas connection for users
│   │   └── inventory.json            # Data file (auto-created)
│   │
│   ├── models/
│   │   └── User.js                   # User schema for authentication
│   │
│   ├── utils/
│   │   ├── excelParser.js            # Parse uploaded files
│   │   └── excelGenerator.js         # Generate download files
│   │
│   ├── uploads/                      # Temporary upload folder
│   └── node_modules/                 # Dependencies
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── UploadForm.jsx
│   │   │   ├── AssetTable.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # Backend API calls
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global Tailwind styles
│   │
│   ├── public/                       # Static assets
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── node_modules/                 # Dependencies
│
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ (includes npm)
- **Two Terminal Windows** (for backend and frontend)
- **Excel File** with asset data (see example below)

### Step 1: Install Backend

```bash
cd backend
npm install
```

### Step 2: Configure MongoDB Atlas for Users

Create `backend/.env` from `backend/.env.example` and set your Atlas credentials:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.d12nazu.mongodb.net/inventory_system?retryWrites=true&w=majority
MONGODB_DB_NAME=inventory_system
```

Do not commit `backend/.env`. If a real MongoDB URI or password was shared, rotate the Atlas database user password before using it.

Inventory asset data still uses `backend/db/inventory.json`; only user management and login use MongoDB Atlas.

### Step 3: Start Backend Server

```bash
npm run dev

# Expected output:
# ╔════════════════════════════════════════════╗
# ║  Asset Inventory System - Backend Running  ║
# ║  Server: http://localhost:5000             ║
# ║  Status: Ready to accept requests          ║
# ╚════════════════════════════════════════════╝
```

### Step 4: Install Frontend

```bash
cd frontend
npm install
```

### Step 5: Start Frontend Dev Server

```bash
npm run dev

# Expected output:
#   ➜  Local:   http://localhost:3000/
#   ➜  press h + enter to show help
```

**Frontend should automatically open in your browser at `http://localhost:3000`**

---

## 📊 Usage Guide

### 1. Upload Excel File

1. **Prepare Excel file** with these columns:
   - Asset
   - Subnumber
   - Asset Description
   - Cost Center
   - Serial number
   - Resp. cost center
   - CORRECT ROOM
   - STATUS (ACCOUNTED / UNACCOUNTED / RECONCILING)
   - REMARKS

2. **Drag and drop** the file into the upload area OR click to browse

3. **Wait for confirmation** message

4. **View table** with all uploaded assets

### 2. Scan QR Codes

1. Click **🎥 Start Camera** button
2. Allow browser to access camera when prompted
3. **Point camera** at QR code/barcode
4. System automatically detects and updates asset status
5. See **green highlight** = asset now ACCOUNTED
6. Click **❌ Stop Camera** when done

### 3. Search & Filter Assets

- **Search box**: Type asset number, description, or serial number
- **Status filter**: Select ACCOUNTED / UNACCOUNTED / RECONCILING
- **Sorting**: Click column headers to sort A→Z or Z→A
- **Statistics**: See real-time counts at top

### 4. Download Updated File

1. Click **📥 Download Excel** button
2. File downloads as `inventory-YYYY-MM-DD.xlsx`
3. Open in Excel to see all updates
4. Color-coded rows indicate status

---

## 🔌 API Documentation

### Health Check
```
GET /
Response: { message, version, status }
```

### Fetch All Assets
```
GET /api/assets
Response: { success, assets[], statistics[] }
```

### Upload Excel File
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: <xlsx file> }
Response: { success, message, assetsAdded, assetsUpdated, totalAssets }
```

### Process QR Scan
```
POST /api/scan
Content-Type: application/json
Body: { scannedValue: "AST001" }
Response: { success, message, asset, action }
```

### Download Excel File
```
GET /api/download
Response: <binary xlsx file>
```

---

## 📝 Example Excel Format

| Asset | Subnumber | Asset Description | Cost Center | Serial number | Resp. cost center | CORRECT ROOM | STATUS | REMARKS |
|-------|-----------|-------------------|--------------|---------------|--------------------|--------------|--------|---------|
| AST001 | SUB001 | Dell Laptop | CC001 | SN12345 | RCC001 | Room 101 | UNACCOUNTED | |
| AST002 | SUB002 | HP Printer | CC002 | SN12346 | RCC002 | Room 102 | UNACCOUNTED | |
| AST003 | SUB003 | Monitor LG | CC001 | SN12347 | RCC001 | Room 101 | UNACCOUNTED | |

---

## 🔍 Troubleshooting

### Backend Issues

| Problem | Solution |
|---------|----------|
| **Port 5000 already in use** | Change `PORT` in backend/server.js or kill the process using port 5000 |
| **npm install fails** | Make sure you have Node.js v16+ installed |
| **Inventory database errors** | Delete `backend/db/inventory.json` to reset inventory data |
| **User login errors** | Check `backend/.env`, Atlas network access, and the `users` collection in `inventory_system` |
| **CORS errors** | Check CORS is enabled in backend/server.js |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| **Cannot connect to backend** | Ensure backend is running on port 5000 and CORS is enabled |
| **Camera not working** | Give browser permission to access camera. Check browser supports WebRTC |
| **Port 3000 already in use** | Change `port` in frontend/vite.config.js or kill the process |
| **Blank page** | Clear browser cache (Ctrl+Shift+Delete) and refresh |

### Upload Issues

| Problem | Solution |
|---------|----------|
| **"Missing required columns"** | Verify Excel file has all 9 columns with exact names |
| **"Excel file is empty"** | Make sure Excel file has data rows below headers |
| **Upload hangs** | File size should be under 10MB |

### Scan Issues

| Problem | Solution |
|---------|----------|
| **"Camera permission denied"** | Allow camera access in browser settings |
| **QR code not detected** | Ensure good lighting, QR code is clear and not damaged |
| **Same asset scanned twice** | 2-second cooldown prevents duplicate scans (intentional) |

---

## 📱 Mobile Access

To access from mobile phone on same network:

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig | find "IPv4"
   
   # Mac/Linux
   ifconfig | grep "inet "
   ```

2. **Access on mobile:**
   ```
   http://<your-ip>:3000
   ```

3. **Grant camera permission** when prompted

---

## 🎯 Testing Workflow

### Test 1: Upload
1. Upload Excel file with 5 assets
2. Verify: "Added: 5, Updated: 0"
3. Confirm table shows 5 rows with "UNACCOUNTED" status

### Test 2: Scan
1. Click "Start Camera"
2. Scan/simulate: `AST001`
3. Verify: "Asset marked as ACCOUNTED!"
4. Confirm: AST001 now green, status = "ACCOUNTED", remarks = "FOUND"

### Test 3: Re-upload
1. Update Excel: Change AST002 description, add new AST006
2. Re-upload file
3. Verify: "Added: 1, Updated: 1"
4. Confirm: AST001 still ACCOUNTED (not overwritten)
5. Confirm: AST002 description updated
6. Confirm: AST006 now in table

### Test 4: Download
1. Click "Download Excel"
2. Open downloaded file
3. Verify: All assets present with updates
4. Verify: Color formatting matches status

---

## 🚢 Deployment

### For Production:

**Backend (Heroku Example):**
```bash
git push heroku main
```

**Frontend (Vercel Example):**
```bash
npm run build
vercel
```

Update `API_BASE_URL` in `frontend/src/services/api.js` to production backend URL.

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev/guide/)
- [HTML5 QRCode](https://github.com/mebjas/html5-qrcode)
- [XLSX.js](https://github.com/SheetJS/sheetjs)

---

## 👨‍💼 Mentoring Notes

This project is designed for **beginners** with:

✅ **Clear comments** explaining each code block
✅ **Simple folder structure** - easy to navigate
✅ **No complex abstractions** - straightforward logic
✅ **JSON inventory storage** - assets stay simple; users authenticate with MongoDB Atlas
✅ **Error handling** - helpful error messages
✅ **Real-world use case** - practical learning

### Learning Opportunities:

1. **Backend**: Express API, file uploads, data validation
2. **Frontend**: React hooks, component composition, API calls
3. **Full Stack**: Request-response cycle, state management
4. **Best Practices**: Error handling, user feedback, data persistence

---

## 📞 Support

For issues or questions:
1. Check **Troubleshooting** section
2. Review **console logs** in both terminal and browser DevTools
3. Verify all **prerequisite** steps completed
4. Check **API responses** are valid JSON

---

## 📄 License

GMADC OJT Project - Educational Use

---

**Happy Coding! 🚀**
