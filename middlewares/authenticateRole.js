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



const authorizeDelete = (req, res, next) => {
  const userIdToDelete = req.params.id;
  const loggedInUser = req.user;

  // Admin can delete anyone
  if (loggedInUser.role === roleMap.admin) {
    return next();
  }

  // Client can delete only themselves
  if (
    loggedInUser.role === roleMap.client &&
    loggedInUser._id.toString() === userIdToDelete
  ) {
    return next();
  }

  // Sub admin or others - deny
  return res.status(403).json({ message: 'Access denied' });
};

module.exports = {authorizeAdminOrSubAdmin, authorizeDelete};

