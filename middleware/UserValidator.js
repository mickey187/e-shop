const Joi = require("joi");
const User = require("../models/User");

const validateUserRegistration = (req, res, next) => {
  const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string()
      .custom(emailUniqueValidator, "Email uniqueness check")
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
    role: Joi.string()
      .valid("customer", "system_admin", "sales_manager", "sales_staff")
      .required(),
  });

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: error.details[0].message,
    });
    //   return res.status(400).json({ error: error.details[0].message });
  }
  console.log("validated", req.body);
  next();
};

const loginRequestValidator = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: error.details[0].message,
    });
    //   return res.status(400).json({ error: error.details[0].message });
  }
  console.log("validated", req.body);
  next();
}

const emailUniqueValidator = async (value, helpers) => {
  try {
    const user = await User.findOne({ email: value });
    if (user) {
      throw new Error("Email is already in use");
    }
    return value;
  } catch (error) {
    throw new Error("Database error");
  }
};



module.exports = { validateUserRegistration, loginRequestValidator };
