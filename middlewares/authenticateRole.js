// middleware/authorizeRole.js

const roleMap = require("../utils/roles");


const authorizeAdminOrSubAdmin = (req, res, next) => {
    console.log(userRole, "this is user role oin ad subad")
  const userRole = req.user.role;

  if (!userRole || (roleMap[userRole] !== roleMap.admin && roleMap[userRole] !== roleMap['sub admin'])) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

module.exports = authorizeAdminOrSubAdmin;
