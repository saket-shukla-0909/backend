// middleware/authorizeRole.js
const roleMap = require('../config/roleMap');

const authorizeAdminOrSubAdmin = (req, res, next) => {
  const userRole = req.user.role;

  if (!userRole || (roleMap[userRole] !== roleMap.admin && roleMap[userRole] !== roleMap['sub admin'])) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

module.exports = authorizeAdminOrSubAdmin;
