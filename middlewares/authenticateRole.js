const roleMap = require("../utils/roles");

const authorizeAdminOrSubAdmin = (req, res, next) => {
  const { role } = req.user;
  if ([roleMap.admin, roleMap['sub admin']].includes(role)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied' });
};

const authorizeDelete = (req, res, next) => {
  const { _id, role } = req.user;
  const targetUserId = req.params.id;

  // Admin can delete anyone
  if (role === roleMap.admin) {
    return next();
  }

  // Any other user can only delete themselves
  if (_id.toString() === targetUserId) {
    return next();
  }

  return res.status(403).json({ message: 'Not authorized to delete this user' });
};

module.exports = { authorizeDelete };


module.exports = {
  authorizeAdminOrSubAdmin,
  authorizeDelete
};
