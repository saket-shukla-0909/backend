const Joi = require('joi');

const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(3).required(),
    profile_picture: Joi.string().uri().optional(),
    phone_number: Joi.string().required(),
    dob: Joi.date().optional(),
    role: Joi.alternatives().try(
      Joi.string().valid('admin', 'sub admin', 'client'),
      Joi.number().valid(1, 2, 3)
    ).optional(),
    status: Joi.number().valid(0, 1).optional() 
  });

  return schema.validate(data);
};

module.exports = validateRegistration;
