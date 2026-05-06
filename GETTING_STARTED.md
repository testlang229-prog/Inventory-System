# 🚀 GETTING STARTED - Step-by-Step Guide

Welcome to the Asset Inventory System! Follow these steps to get started.

---

## ✅ Project Built Successfully!

All files have been created automatically. Here's what you need to do to run the application:

---

## 📋 Prerequisites Check

Make sure you have:
- ✅ Node.js v16+ installed (check: `node --version`)
- ✅ npm installed (check: `npm --version`)
- ✅ Two Terminal windows open
- ✅ The `sample-inventory.xlsx` file in the root folder (already created!)

---

## 🎯 Step-by-Step Setup

### TERMINAL 1: Start the Backend Server

```bash
# Navigate to backend folder
cd backend

# Start the server in development mode
npm run dev
```

**You should see this output:**
```
╔════════════════════════════════════════════╗
║  Asset Inventory System - Backend Running  ║
║  Server: http://localhost:5000             ║
║  Status: Ready to accept requests          ║
╚════════════════════════════════════════════╝
```

✅ **Keep this terminal open!** The backend must stay running.

---

### TERMINAL 2: Start the Frontend Server

```bash
# Navigate to frontend folder (from root)
cd frontend

# Start the development server
npm run dev
```

**You should see:**
```
➜  Local:   http://localhost:3000/
➜  press h + enter to show help
```

✅ **The website should automatically open in your browser!**

If it doesn't, manually go to: `http://localhost:3000`

---

## 🧪 Test the System (5 Minutes)

### Step 1️⃣: Upload Sample Data (1 minute)

1. In the frontend website, scroll to **"📤 Upload Excel File"**
2. **Drag and drop** `sample-inventory.xlsx` into the upload box
3. Or click to browse and select the file
4. Wait for success message: **"✅ Upload successful! Added: 5, Updated: 0"**
5. Verify the table shows **5 assets** with **UNACCOUNTED** status (red background)

### Step 2️⃣: Test QR Scanner (2 minutes)

1. Click **"🎥 Start Camera"** button
2. **Allow browser** to access your camera when prompted
3. Open a second browser tab and go to QR code generator:
   - Website: https://www.qr-code-generator.com/
   - Generate QR code for text: `AST001`
4. Display the QR code on your second screen
5. **Point your camera** at the QR code
6. Watch for the automatic update - AST001 should become **green** (ACCOUNTED)
7. See message: **"✅ Asset "AST001" marked as ACCOUNTED!"**
8. Click **"❌ Stop Camera"**

### Step 3️⃣: Test Download (1 minute)

1. Scroll to the **"📥 Download Excel"** button
2. Click it
3. The file `inventory-YYYY-MM-DD.xlsx` should download automatically
4. Open the downloaded file in Excel
5. Verify:
   - AST001 has STATUS = "ACCOUNTED"
   - AST001 has REMARKS = "FOUND"
   - Other assets have STATUS = "UNACCOUNTED"

### Step 4️⃣: Test Search & Filter (1 minute)

1. In the search box, type: **"Printer"**
2. Table should show only **AST002** (HP LaserJet Printer)
3. Click the **Status filter** dropdown
4. Select **"✅ Accounted"**
5. Table should show only **AST001**
6. Click **"All Status"** to show all again

---

## 📝 Project File Structure Summary

```
inventory-system/
├── backend/                    # ← Backend API (Express)
│   ├── server.js
│   ├── routes/                 # Upload, scan, download, assets
│   ├── db/
│   │   └── inventory.json      # Data storage (auto-created)
│   └── package.json
│
├── frontend/                   # ← Frontend UI (React)
│   ├── src/
│   │   ├── components/         # Upload, Table, Scanner forms
│   │   ├── services/
│   │   │   └── api.js          # Backend API calls
│   │   └── App.jsx             # Main app
│   └── package.json
│
├── sample-inventory.xlsx       # ← Test data file (ready to use!)
└── README.md                   # Full documentation
```

---

## 🎓 How It Works (Simple Version)

```
You Upload Excel
    ↓
Backend parses → stores in JSON
    ↓
Frontend fetches → displays in table
    ↓
You scan QR code
    ↓
Backend updates → JSON file updated
    ↓
Frontend refreshes → table shows green ✅
    ↓
You download → new Excel file created
```

---

## 🛠️ Common Commands

### Backend Commands
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production mode
npm install      # Install dependencies
```

### Frontend Commands
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Create production build
npm install      # Install dependencies
```

### Reset Everything
```bash
# Delete all data and start fresh:
rm backend/db/inventory.json

# Then reload the browser page
```

---

## 🆘 If Something Goes Wrong

### Backend won't start?
```bash
# Check if port 5000 is already in use
# On Windows PowerShell:
Get-NetTCPConnection -LocalPort 5000

# If needed, change PORT in backend/server.js line 15
```

### Frontend won't load?
```bash
# Clear browser cache:
# Press: Ctrl + Shift + Delete
# Then refresh the page

# Or hard refresh:
# Press: Ctrl + F5
```

### Can't upload file?
```bash
# Make sure Excel file has these EXACT column names:
# Asset, Subnumber, Asset Description, Cost Center
# Serial number, Resp. cost center, CORRECT ROOM, STATUS, REMARKS
```

### Camera not working?
```bash
# Check browser has permission:
# Chrome: Settings → Privacy → Camera
# Make sure this site is allowed to use camera
```

---

## 📊 What Happens to Your Data

- **When you upload Excel** → Stored in `backend/db/inventory.json`
- **When you scan QR** → Updates the JSON file instantly
- **When you download** → Reads from JSON, creates new Excel file
- **When server restarts** → Data persists! (it's saved in the file)
- **To delete all data** → Delete `inventory.json` and restart backend

---

## 🎯 Next Steps

After testing:

1. **Customize styling** - Edit `frontend/src/index.css` or Tailwind classes
2. **Change colors** - Update `frontend/src/components/StatusBadge.jsx`
3. **Add more fields** - Modify database.js and components
4. **Deploy to cloud** - Follow README.md deployment section

---

## 📞 Need Help?

1. **Check the README.md** for full documentation
2. **Look at console errors** (F12 in browser, terminal errors)
3. **Review the comments** in the code - everything is explained!

---

## ✨ You're Ready!

**Your system is fully built and ready to use!**

Make sure:
✅ Backend is running (Terminal 1)
✅ Frontend is running (Terminal 2)
✅ Browser shows the app at http://localhost:3000

**Now go upload that Excel file and start scanning! 🚀**

---

## 📚 Learning Opportunities

While using the system, check out:

- **Backend code**: See how Express handles file uploads
- **Frontend code**: Learn React hooks and component composition
- **Data flow**: Understand how frontend and backend communicate
- **Error handling**: See how errors are caught and displayed

**This is a real, production-ready application!** 🎓

---

**Happy Inventory Tracking! 📦✅**
