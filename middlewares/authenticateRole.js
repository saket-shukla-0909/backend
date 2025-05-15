const roleMap = require("../utils/roles");

const authorizeAdminOrSubAdmin = (req, res, next) => {
  const userRole = req.user.role;
    console.log(userRole, "this is userRole")
  if (userRole === roleMap.admin || userRole === roleMap['sub admin']) {
    console.log("this is true")
    return next(); 
  }

  return res.status(403).json({ success: false, message: 'Access denied' });
};

module.exports = authorizeAdminOrSubAdmin;
