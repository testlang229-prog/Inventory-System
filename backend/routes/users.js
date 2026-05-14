// backend/routes/users.js
// Routes for user management (admin only)

const express = require('express');
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');
const {
  authenticateToken,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Path to users data file
const usersFilePath = path.join(__dirname, '../db/users.json');

// Helper function to read users
const readUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Helper function to write users
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
};

// GET /api/users - Get all users
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = readUsers();
    const sanitized = users.map(u => ({
      id: u.id,
      employeeId: u.employeeId,
      department: u.department,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
    res.json({ success: true, users: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST /api/users - Create a new user
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
  employeeId,
  name,
  department,
  password,
  role = 'user',
} = req.body;

    if (!employeeId || !name || !department || !password) {
  return res.status(400).json({
    success: false,
    message: 'Employee ID, Department, and Password are required'
  });
}

    const users = readUsers();

    // Check if employee already exists
    if (users.some(u => u.employeeId === employeeId)) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
  id: Date.now().toString(),
  employeeId,
  name,
  department,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    writeUsers(users);

    res.json({ 
      success: true, 
      message: 'User created successfully',
      user: newUser 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// PUT /api/users/:employeeId - Update a user
// PUT /api/users/:employeeId - Update a user
router.put('/:employeeId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      employeeId: newEmployeeId,
      name,
      department,
      password,
      role
    } = req.body;

    const { employeeId } = req.params;

    const users = readUsers();

    const userIndex = users.findIndex(
      u => u.employeeId === employeeId
    );

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent duplicate employee IDs
    if (
      newEmployeeId &&
      newEmployeeId !== employeeId &&
      users.some(u => u.employeeId === newEmployeeId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    // Update fields
    if (newEmployeeId) {
      users[userIndex].employeeId = newEmployeeId;
    }

    if (name) {
      users[userIndex].name = name;
    }

    if (department) {
      users[userIndex].department = department;
    }

    if (role) {
      users[userIndex].role = role;
    }

    // Re-hash new password
    if (password && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      users[userIndex].passwordHash = passwordHash;
    }

    writeUsers(users);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[userIndex]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:employeeId - Delete a user
router.delete('/:employeeId', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { employeeId } = req.params;

    const users = readUsers();
    if (employeeId === 'admin') {
  return res.status(403).json({
    success: false,
    message: 'Main admin account cannot be deleted'
  });
}
    const filteredUsers = users.filter(u => u.employeeId !== employeeId);

    if (filteredUsers.length === users.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    writeUsers(filteredUsers);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// POST /api/users/login - Validate user login
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and password are required',
      });
    }

    const users = readUsers();

    const matchedUser = users.find(
      user =>
        String(user.employeeId).trim() ===
        String(employeeId).trim()
    );

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const validPassword = await bcrypt.compare(
  password,
  matchedUser.passwordHash
);

if (!validPassword) {
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials',
  });
}

    matchedUser.lastLogin = new Date().toISOString();
    writeUsers(users);

    const token = generateToken(matchedUser);

    res.json({
      success: true,
      token,
      user: {
  employeeId: matchedUser.employeeId,
  name: matchedUser.name,
  department: matchedUser.department,
  role: matchedUser.role,
},
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

module.exports = router;
