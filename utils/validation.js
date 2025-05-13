const Joi = require('joi');

// Joi validation schema for user registration
const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(3).required(),
    profile_picture: Joi.string().uri().optional(),
    phone_number: Joi.string().required(), // Make phone_number required
    dob: Joi.date().optional()
  });
  return schema.validate(data);
};

module.exports = validateRegistration;
