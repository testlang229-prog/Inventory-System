// CREATE SAMPLE EXCEL FILE - Run this to generate test data
// Save as: generate-sample-excel.js in the root inventory-system folder
// Then run: node generate-sample-excel.js

const XLSX = require('xlsx');
const path = require('path');

// Sample asset data
const sampleData = [
  {
    'Asset': 'AST001',
    'Subnumber': 'SUB001',
    'Asset Description': 'Dell Laptop - i7',
    'Cost Center': 'CC001',
    'Serial number': 'SN12345ABC',
    'Resp. cost center': 'RCC001',
    'CORRECT ROOM': 'Room 101',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  },
  {
    'Asset': 'AST002',
    'Subnumber': 'SUB002',
    'Asset Description': 'HP LaserJet Printer',
    'Cost Center': 'CC002',
    'Serial number': 'SN12346DEF',
    'Resp. cost center': 'RCC002',
    'CORRECT ROOM': 'Room 102',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  },
  {
    'Asset': 'AST003',
    'Subnumber': 'SUB003',
    'Asset Description': 'LG 24 inch Monitor',
    'Cost Center': 'CC001',
    'Serial number': 'SN12347GHI',
    'Resp. cost center': 'RCC001',
    'CORRECT ROOM': 'Room 101',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  },
  {
    'Asset': 'AST004',
    'Subnumber': 'SUB004',
    'Asset Description': 'Mechanical Keyboard RGB',
    'Cost Center': 'CC003',
    'Serial number': 'SN12348JKL',
    'Resp. cost center': 'RCC003',
    'CORRECT ROOM': 'Room 103',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  },
  {
    'Asset': 'AST005',
    'Subnumber': 'SUB005',
    'Asset Description': 'Wireless Mouse - Logitech',
    'Cost Center': 'CC003',
    'Serial number': 'SN12349MNO',
    'Resp. cost center': 'RCC003',
    'CORRECT ROOM': 'Room 103',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  },
  {
    'Asset': 'AST006',
    'Subnumber': 'SUB006',
    'Asset Description': 'External Hard Drive 2TB',
    'Cost Center': 'CC001',
    'Serial number': 'SN12350PQR',
    'Resp. cost center': 'RCC001',
    'CORRECT ROOM': 'Room 104',
    'STATUS': 'UNACCOUNTED',
    'REMARKS': ''
  }
];

try {
  // Create a new workbook
  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assets');

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Asset
    { wch: 12 }, // Subnumber
    { wch: 25 }, // Asset Description
    { wch: 12 }, // Cost Center
    { wch: 15 }, // Serial number
    { wch: 12 }, // Resp. cost center
    { wch: 12 }, // CORRECT ROOM
    { wch: 15 }, // STATUS
    { wch: 20 }  // REMARKS
  ];

  // Write to file
  const filePath = path.join(__dirname, 'sample-inventory.xlsx');
  XLSX.writeFile(wb, filePath);
  
  console.log(`✅ Sample Excel file created: ${filePath}`);
  console.log(`📊 Total rows: ${sampleData.length}`);
  console.log(`📝 All assets are set to UNACCOUNTED status`);
  console.log(`🎯 Use this file to test the upload feature`);
} catch (error) {
  console.error('❌ Error creating sample file:', error.message);
}
