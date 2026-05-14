const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'inventory-secret-key';

function generateToken(user) {
  return jwt.sign(
    {
      employeeId: user.employeeId,
      department: user.department,
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};