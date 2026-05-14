// backend/routes/users.js
// Routes for user management (admin only)

const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');
const { ensureMongoConnected } = require('../db/mongoose');
const User = require('../models/User');
const {
  authenticateToken,
  requireAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ensureMongoConnected);

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    employeeId: user.employeeId,
    email: user.email,
    name: user.name,
    department: user.department,
    role: user.role || 'user',
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}

function isDuplicateKeyError(error) {
  return error && error.code === 11000;
}

function duplicateMessage(error) {
  const field = Object.keys(error.keyPattern || error.keyValue || {})[0];
  if (field === 'email') return 'Email already exists';
  return 'Employee ID already exists';
}

// GET /api/users - Get all users
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, users: users.map(sanitizeUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST /api/users - Create a new user
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      employeeId,
      email,
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

    // Check if employee already exists
    const existingUser = await User.findOne({ employeeId: employeeId.trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      id: Date.now().toString(),
      employeeId: employeeId.trim(),
      email: email ? email.trim() : undefined,
      name: name.trim(),
      department: department.trim(),
      passwordHash,
      role,
      lastLogin: null
    });

    res.json({ 
      success: true, 
      message: 'User created successfully',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(400).json({ success: false, message: duplicateMessage(error) });
    }
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// PUT /api/users/:employeeId - Update a user
router.put('/:employeeId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      employeeId: newEmployeeId,
      email,
      name,
      department,
      password,
      role
    } = req.body;

    const { employeeId } = req.params;

    const user = await User.findOne({ employeeId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent duplicate employee IDs
    if (
      newEmployeeId &&
      newEmployeeId !== employeeId &&
      await User.exists({ employeeId: newEmployeeId.trim() })
    ) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    // Update fields
    if (newEmployeeId) {
      user.employeeId = newEmployeeId.trim();
    }

    if (email !== undefined) {
      user.email = email ? email.trim() : undefined;
    }

    if (name) {
      user.name = name.trim();
    }

    if (department) {
      user.department = department.trim();
    }

    if (role) {
      user.role = role;
    }

    // Re-hash new password
    if (password && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 10);
      user.passwordHash = passwordHash;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: sanitizeUser(user)
    });

  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(400).json({
        success: false,
        message: duplicateMessage(error)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:employeeId - Delete a user
router.delete('/:employeeId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (employeeId === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Main admin account cannot be deleted'
      });
    }

    const result = await User.deleteOne({ employeeId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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

    const matchedUser = await User.findOne({
      employeeId: String(employeeId).trim(),
    });

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

    matchedUser.lastLogin = new Date();
    await matchedUser.save();

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
