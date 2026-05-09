/**
 * Test script to verify asset duplication fix
 * This script tests adding multiple assets sequentially
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

async function testAssetCreation() {
  try {
    console.log('🧪 Testing Asset Duplication Fix\n');
    
    // Test 1: Add first asset
    console.log('Test 1: Adding first asset (ASSET-001)...');
    const response1 = await makeRequest('POST', '/api/assets', {
      fields: {
        'Asset': 'ASSET-001',
        'Asset Description': 'First Test Asset',
        'Serial number': 'SN-001',
        'Cost Center': '12345',
        'Resp. cost center': '54321',
        'CORRECT ROOM': 'ROOM-1',
      },
    });
    
    if (response1.status === 201) {
      console.log('✅ First asset added successfully');
      console.log(`   Asset ID: ${response1.data.asset.id}`);
    } else {
      console.log(`❌ Failed to add first asset: ${response1.data.message}`);
    }
    
    // Test 2: Add second asset
    console.log('\nTest 2: Adding second asset (ASSET-002)...');
    const response2 = await makeRequest('POST', '/api/assets', {
      fields: {
        'Asset': 'ASSET-002',
        'Asset Description': 'Second Test Asset',
        'Serial number': 'SN-002',
        'Cost Center': '12345',
        'Resp. cost center': '54321',
        'CORRECT ROOM': 'ROOM-2',
      },
    });
    
    if (response2.status === 201) {
      console.log('✅ Second asset added successfully');
      console.log(`   Asset ID: ${response2.data.asset.id}`);
    } else {
      console.log(`❌ Failed to add second asset: ${response2.data.message}`);
    }
    
    // Test 3: Try to add duplicate asset (should fail)
    console.log('\nTest 3: Attempting to add duplicate asset (ASSET-001)...');
    const response3 = await makeRequest('POST', '/api/assets', {
      fields: {
        'Asset': 'ASSET-001',
        'Asset Description': 'Duplicate Test Asset',
        'Serial number': 'SN-001',
        'Cost Center': '12345',
        'Resp. cost center': '54321',
        'CORRECT ROOM': 'ROOM-1',
      },
    });
    
    if (response3.status === 409) {
      console.log('✅ Duplicate prevention working! Got expected 409 error');
      console.log(`   Message: ${response3.data.message}`);
    } else {
      console.log(`❌ Duplicate not prevented! Status: ${response3.status}`);
      console.log(`   Data: ${JSON.stringify(response3.data)}`);
    }
    
    // Test 4: Fetch all assets to verify count
    console.log('\nTest 4: Fetching all assets to verify count...');
    const response4 = await makeRequest('GET', '/api/assets');
    const totalAssets = response4.data.assets.length;
    console.log(`✅ Total assets in system: ${totalAssets}`);
    console.log(`   Assets: ${response4.data.assets.map(a => a.asset).join(', ')}`);
    
    console.log('\n✨ Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

// Run tests
testAssetCreation();
