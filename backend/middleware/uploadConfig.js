// backend/middleware/uploadConfig.js
// Configures multer for file uploads

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create a storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files are stored in the uploads folder
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Name files with timestamp to avoid conflicts
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// File filter to only allow Excel files
const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.xlsx', '.xls'];
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
    'application/zip',
  ];

  if (allowedExtensions.includes(extension) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Only Excel files (.xlsx, .xls) are allowed'),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

module.exports = upload;
