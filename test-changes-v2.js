/**
 * Test script to verify the changes:
 * 1. New assets have blank remarks and month status
 * 2. Assets appear in ascending order (new at bottom)
 */

const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testChanges() {
  try {
    console.log('🧪 Testing Changes\n');
    
    // Test 1: Add new asset with blank remarks and month status
    const uniqueId = Date.now();
    console.log(`Test 1: Adding new asset (TEST-ASSET-${uniqueId})...`);
    const response1 = await makeRequest('POST', '/api/assets', {
      fields: {
        'Asset': `TEST-ASSET-${uniqueId}`,
        'Asset Description': 'Test Asset for New Changes',
        'Serial number': `SN-TEST-${uniqueId}`,
        'Cost Center': '12345',
        'Resp. cost center': '54321',
        'CORRECT ROOM': 'TEST-ROOM',
      },
    });
    
    if (response1.status === 201) {
      console.log('✅ New asset added successfully');
      const asset = response1.data.asset;
      console.log(`   Asset: ${asset.asset}`);
      console.log(`   Remarks: "${asset.remarks}" (should be empty)`);
      
      // Find the month status field (MAY STATUS or current month)
      let monthStatusValue = '';
      let monthStatusField = '';
      Object.keys(asset).forEach(key => {
        if (key.toUpperCase().includes('STATUS') && !key.toUpperCase().includes('ACCOUNTED')) {
          if (monthStatusValue === '') {
            monthStatusField = key;
            monthStatusValue = asset[key];
          }
        }
      });
      console.log(`   ${monthStatusField}: "${monthStatusValue}" (should be empty)`);
      
      if (asset.remarks === '' && monthStatusValue === '') {
        console.log('   ✅ Remarks and month status are blank as expected!');
      } else {
        console.log('   ❌ Remarks or month status are not blank!');
      }
    } else {
      console.log(`❌ Failed to add asset: ${response1.data.message}`);
    }
    
    // Test 2: Check asset order
    console.log('\nTest 2: Checking asset order (newest should be at bottom)...');
    const response2 = await makeRequest('GET', '/api/assets');
    const assets = response2.data.assets;
    
    if (assets.length > 1) {
      const firstAsset = assets[0];
      const lastAsset = assets[assets.length - 1];
      
      console.log(`   First asset in list: ID ${firstAsset.id} (${firstAsset.asset})`);
      console.log(`   Last asset in list: ID ${lastAsset.id} (${lastAsset.asset})`);
      
      if (firstAsset.id < lastAsset.id) {
        console.log('   ✅ Assets are ordered correctly (ascending by ID - new at bottom)!');
      } else {
        console.log('   ❌ Assets are not in correct order!');
      }
    }
    
    console.log('\n✨ Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run tests
testChanges();
