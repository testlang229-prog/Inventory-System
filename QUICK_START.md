# 🚀 QUICK START COMMANDS

Copy and paste these commands to start the system:

---

## Terminal 1 (Backend)
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Database initialized successfully
╔════════════════════════════════════════════╗
║  Asset Inventory System - Backend Running  ║
║  Server: http://localhost:5000             ║
║  Status: Ready to accept requests          ║
╚════════════════════════════════════════════╝
```

---

## Terminal 2 (Frontend)
```bash
cd frontend
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

Browser automatically opens or visit: **http://localhost:3000**

---

## 🧪 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000 and browser shows website
- [ ] Upload `sample-inventory.xlsx` file
- [ ] See success message with "Added: 5"
- [ ] Table shows 5 assets with red background (UNACCOUNTED)
- [ ] Click "Start Camera" for barcode/QR scanning
- [ ] Generate a Code 128 barcode or QR code for "AST001" at https://barcode.tec-it.com/
- [ ] Scan the barcode/QR code - AST001 should turn green
- [ ] Click "Download Excel" and open the file
- [ ] Verify AST001 status = "ACCOUNTED" with remarks = "FOUND"

✅ If all checkboxes pass → System is working perfectly!

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `backend/server.js` | Main backend server |
| `backend/db/inventory.json` | Data storage (auto-created) |
| `frontend/src/App.jsx` | Main React app |
| `sample-inventory.xlsx` | Test data (ready to use) |
| `README.md` | Full documentation |
| `GETTING_STARTED.md` | Detailed setup guide |

---

## 💡 Key Features to Try

1. **Upload Excel** - See smart upsert in action
2. **Search Assets** - Filter by name/description/serial
3. **Scan Barcode/QR** - Try the mobile scanner
4. **Download** - Export updated inventory
5. **Sort Columns** - Click headers to sort
6. **Filter by Status** - See color-coded assets

---

**Everything is ready! Start the backends and have fun! 🎉**
