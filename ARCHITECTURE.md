# System Architecture

This document summarizes the current structure, data flow, API surface, and technology stack for the inventory system.

---

## Project Structure

```text
inventory-system/
|-- QUICK_START.md
|-- GETTING_STARTED.md
|-- README.md
|-- ARCHITECTURE.md
|-- sample-inventory.xlsx
|-- generate-sample-excel.js
|
|-- backend/
|   |-- server.js
|   |-- package.json
|   |
|   |-- routes/
|   |   |-- upload.js       POST /api/upload
|   |   |-- scan.js         POST /api/scan
|   |   |-- download.js     GET /api/download
|   |   `-- assets.js       GET /api/assets, DELETE /api/assets
|   |
|   |-- middleware/
|   |   `-- uploadConfig.js Multer Excel upload configuration
|   |
|   |-- db/
|   |   |-- database.js     JSON file database helpers
|   |   `-- inventory.json  Persisted inventory data
|   |
|   |-- utils/
|   |   |-- excelParser.js  Adaptive Excel parser
|   |   `-- excelGenerator.js
|   |
|   `-- uploads/           Temporary uploaded Excel files
|
`-- frontend/
    |-- index.html
    |-- package.json
    |-- vite.config.js
    |-- tailwind.config.js
    |
    `-- src/
        |-- App.jsx
        |-- main.jsx
        |-- index.css
        |
        |-- components/
        |   |-- UploadForm.jsx
        |   |-- AssetTable.jsx
        |   |-- QRScanner.jsx
        |   `-- StatusBadge.jsx
        |
        `-- services/
            `-- api.js
```

---

## Tech Stack

Frontend:
- React 18
- Vite
- Tailwind CSS
- Axios
- html5-qrcode

Backend:
- Node.js
- Express.js
- Multer
- CORS
- XLSX / SheetJS
- ExcelJS

Storage:
- File-based JSON database at `backend/db/inventory.json`

Dev tooling:
- npm
- Nodemon
- PowerShell / terminal

---

## Runtime Architecture

```text
Browser / React frontend
  |
  | Axios HTTP requests
  v
Express backend on http://localhost:5000
  |
  |-- /api/upload   -> Multer -> excelParser.js -> database.js
  |-- /api/assets   -> database.js
  |-- /api/scan     -> database.js update status/remarks
  |-- /api/download -> database.js -> excelGenerator.js
  |
  v
backend/db/inventory.json
```

The frontend owns presentation and local UI state. The backend owns file parsing, asset matching, persistence, and Excel generation.

---

## Main Features

- Upload `.xlsx` and `.xls` inventory files.
- Automatically detect common Excel column names and header rows.
- Search, sort, and filter the asset table.
- Scan QR codes and common barcode formats using the camera.
- Manually enter an asset number, serial number, or barcode value as a scan fallback.
- Mark matching scanned assets as `ACCOUNTED` and set remarks to `FOUND`.
- Download the updated inventory as an Excel file.
- Clear the whole current asset list before uploading a new file.

---

## Data Model

Stored in `backend/db/inventory.json`:

```json
{
  "assets": [
    {
      "id": 1,
      "asset": "AST001",
      "subnumber": "0",
      "assetDescription": "Dell Laptop - i7",
      "costCenter": "CC001",
      "serialNumber": "SN12345ABC",
      "respCostCenter": "RCC001",
      "correctRoom": "Room 101",
      "status": "ACCOUNTED",
      "remarks": "FOUND",
      "createdAt": "2026-05-06T12:30:45.123Z",
      "updatedAt": "2026-05-06T14:25:30.456Z"
    }
  ],
  "nextId": 2
}
```

Core asset fields:
- `asset`
- `subnumber`
- `assetDescription`
- `costCenter`
- `serialNumber`
- `respCostCenter`
- `correctRoom`
- `status`
- `remarks`

---

## API Endpoints

### Health Check

```http
GET /
```

Returns backend status.

### Fetch Assets

```http
GET /api/assets
```

Response:

```json
{
  "success": true,
  "assets": [],
  "statistics": []
}
```

### Clear Assets

```http
DELETE /api/assets
```

Removes the whole current list from `inventory.json`.

Response:

```json
{
  "success": true,
  "message": "Inventory list cleared successfully"
}
```

### Upload Excel

```http
POST /api/upload
Content-Type: multipart/form-data
```

Body:

```text
file=<.xlsx or .xls file>
```

Response:

```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "assetsAdded": 5,
  "assetsUpdated": 0,
  "totalAssets": 5
}
```

### Process Scan

```http
POST /api/scan
Content-Type: application/json
```

Body:

```json
{
  "scannedValue": "AST001"
}
```

Behavior:
- Matches `scannedValue` against asset number or serial number.
- If matched, sets `status` to `ACCOUNTED`.
- Sets `remarks` to `FOUND`.
- Returns action `UPDATED` or `ALREADY_ACCOUNTED`.

### Download Excel

```http
GET /api/download
```

Returns a binary `.xlsx` file attachment.

---

## Excel Import Flow

```text
UploadForm.jsx
  -> uploadExcelFile(file)
  -> POST /api/upload
  -> upload.js
  -> uploadConfig.js stores temp file
  -> excelParser.js reads first sheet
  -> detects header row from first 15 rows
  -> maps common column aliases to internal fields
  -> validateAssets()
  -> database.js upsertAsset()
  -> delete temp upload
  -> frontend reloads asset list
```

The parser accepts common aliases, such as:
- Asset: `Asset`, `Asset No`, `Asset Number`, `Property No`, `Item Number`
- Description: `Asset Description`, `Description`, `Item Description`, `Particulars`
- Serial: `Serial number`, `Serial No`, `Serial`, `S/N`, `SN`
- Room/location: `CORRECT ROOM`, `Room`, `Location`, `Actual Location`, `Office`
- Status: `STATUS`, `Inventory Status`
- Remarks: `REMARKS`, `Notes`, `Comments`

Required detected fields:
- Asset number
- Asset description

---

## Scan Flow

```text
Camera barcode/QR scan or manual input
  -> QRScanner.jsx
  -> processScan(scannedValue)
  -> POST /api/scan
  -> scan.js searches inventory by asset or serial number
  -> database.js updateAssetStatus(asset.id, "ACCOUNTED", "FOUND")
  -> frontend reloads asset list
```

Supported camera scan formats include:
- QR Code
- Code 128
- Code 39
- Code 93
- EAN-13
- EAN-8
- UPC-A
- UPC-E
- ITF
- Codabar

Manual scan accepts the same values as camera scan.

---

## Clear List Flow

```text
AssetTable.jsx Clear List button
  -> App.jsx confirmation prompt
  -> clearAssets()
  -> DELETE /api/assets
  -> database.js deleteAllAssets()
  -> frontend state set to []
```

This is useful before uploading a completely different company file or Excel format.

---

## Download Flow

```text
AssetTable.jsx Download Excel button
  -> downloadExcel()
  -> GET /api/download
  -> download.js
  -> database.js getAllAssets()
  -> excelGenerator.js creates workbook
  -> browser downloads inventory-yyyy-mm-dd.xlsx
```

---

## Storage Strategy

| Data | Location | Format | Persistence |
| --- | --- | --- | --- |
| Assets | `backend/db/inventory.json` | JSON | Persistent |
| Temporary uploads | `backend/uploads/` | Excel files | Deleted after processing |
| Frontend state | React state | JavaScript objects | Session only |
| Download output | Browser download | `.xlsx` | User-saved file |

---

## Security And Validation

- Uploads are limited to `.xlsx` and `.xls` extensions.
- Excel MIME types and common generic upload MIME types are handled.
- Upload size is limited to 10 MB.
- CORS is enabled for frontend-to-backend communication.
- Uploaded temp files are deleted after processing or after upload errors.
- Scan requests require a non-empty `scannedValue`.
- Clear-list action requires frontend confirmation before calling the API.

---

## Important Implementation Notes

- `database.js` is synchronous and file-based. This is simple and fine for a local/single-user workflow, but it is not ideal for many simultaneous users.
- `upsertAsset()` matches existing records by asset number or serial number.
- If an existing asset is already `ACCOUNTED`, uploads preserve its accounted status while refreshing non-critical details.
- Scans always set remarks to `FOUND` when a matching asset is found.
- Camera permission requires `localhost` or HTTPS. Plain HTTP over a network IP may not trigger camera access.

---

## Extension Points

Add a new Excel field:
1. Add aliases in `backend/utils/excelParser.js`.
2. Add the field to `database.js`.
3. Add a table column in `AssetTable.jsx`.
4. Add the column to `excelGenerator.js`.

Move to a real database:
1. Replace `backend/db/database.js` with SQLite, PostgreSQL, MySQL, or another database layer.
2. Convert synchronous JSON helpers to async database queries.
3. Keep route interfaces the same where possible.

Add authentication:
1. Add login/session or token middleware in the backend.
2. Protect destructive endpoints like `DELETE /api/assets`.
3. Store user identity with scan/update audit records.

