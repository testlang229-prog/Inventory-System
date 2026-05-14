require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');

const usersFilePath = path.join(__dirname, '..', 'db', 'users.json');

function normalizeUser(user) {
  return {
    id: String(user.id || Date.now()),
    employeeId: String(user.employeeId || '').trim(),
    email: user.email ? String(user.email).trim().toLowerCase() : undefined,
    name: String(user.name || '').trim(),
    department: String(user.department || '').trim(),
    passwordHash: user.passwordHash,
    role: user.role || 'user',
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
  };
}

function validateUser(user) {
  const missing = [];

  if (!user.employeeId) missing.push('employeeId');
  if (!user.name) missing.push('name');
  if (!user.department) missing.push('department');
  if (!user.passwordHash) missing.push('passwordHash');

  return missing;
}

async function migrateUsers() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required in backend/.env');
  }

  const rawUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  if (!Array.isArray(rawUsers)) {
    throw new Error('backend/db/users.json must contain an array of users');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
    serverSelectionTimeoutMS: 10000,
  });

  let imported = 0;
  let skipped = 0;

  for (const rawUser of rawUsers) {
    const user = normalizeUser(rawUser);
    const missing = validateUser(user);

    if (missing.length > 0) {
      skipped += 1;
      console.warn(
        `Skipped user "${rawUser.employeeId || rawUser.id || 'unknown'}": missing ${missing.join(', ')}`
      );
      continue;
    }

    await User.updateOne(
      { employeeId: user.employeeId },
      { $set: user },
      { upsert: true, runValidators: true }
    );

    imported += 1;
  }

  console.log(`Migration complete. Imported/updated: ${imported}. Skipped: ${skipped}.`);
}

migrateUsers()
  .catch(error => {
    console.error('User migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
