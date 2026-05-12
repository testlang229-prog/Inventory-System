const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'db', 'inventory.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('✅ Verification of Changes\n');

// Check the last 3 assets
console.log('Last 3 assets in the system:');
console.log('================================');

const lastAssets = data.assets.slice(-3);
lastAssets.forEach((asset, index) => {
  console.log(`\nAsset ${index + 1}:`);
  console.log(`  ID: ${asset.id}`);
  console.log(`  Asset Number: ${asset.asset}`);
  console.log(`  Remarks: "${asset.remarks}"`);
  
  // Find monthly status field
  Object.keys(asset).forEach(key => {
    if (key.includes('STATUS') && !key.includes('ACCOUNTED') && key.toLowerCase() !== 'status') {
      console.log(`  ${key}: "${asset[key]}"`);
    }
  });
});

console.log('\n================================');
console.log('✅ Verification Results:');

// Verify order
const firstAsset = data.assets[0];
const lastAsset = data.assets[data.assets.length - 1];
console.log(`\n1. Order Check:`);
console.log(`   First Asset ID: ${firstAsset.id} (${firstAsset.asset})`);
console.log(`   Last Asset ID: ${lastAsset.id} (${lastAsset.asset})`);

if (firstAsset.id < lastAsset.id) {
  console.log(`   ✅ PASS: Assets are in ascending order (new at bottom)`);
} else {
  console.log(`   ❌ FAIL: Assets are not in correct order`);
}

// Verify remarks and month status are blank for new assets
console.log(`\n2. New Assets - Remarks and Monthly Status Check:`);
const allBlank = lastAssets.every(asset => {
  let monthStatusBlank = true;
  Object.keys(asset).forEach(key => {
    if (key.includes('STATUS') && !key.includes('ACCOUNTED') && key.toLowerCase() !== 'status') {
      if (asset[key] !== '' && asset[key] !== null && asset[key] !== undefined) {
        monthStatusBlank = false;
      }
    }
  });
  return asset.remarks === '' && monthStatusBlank;
});

if (allBlank) {
  console.log(`   ✅ PASS: Remarks and monthly status are blank for new assets`);
} else {
  console.log(`   ❌ FAIL: Some assets have non-blank remarks or monthly status`);
}

console.log('\n✨ All verification completed!');
