import Joi from "@hapi/joi";

const loginRegisterValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Email is invalid",
      "any.required": "Email is required"
    }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "string.base": "password must be a string",
      "any.required": "password is required",
      "string.min": "password must be 8 characters long"
    })
});

const idValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "string.base": `${key} must be a string`,
      "any.required": `${key} is required`,
      "string.guid": `invalid ${key} format`
    });

const idParamValidation = Joi.object({
  id: idValidation("id")
});

const stripeIdParamValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      "string.base": `must be a string`,
      "any.required": `is required`
    })
});

const requiredStringValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .required()
    .messages({
      "string.base": `${key} must be a string`,
      "any.required": `${key} is required`
    });

const optionalStringValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .optional()
    .messages({
      "string.base": `${key} must be a string`
    });

const requiredRegNumberValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .required()
    .regex(/^([0-9A-Z]){2,7}$/)
    .messages({
      "string.base": `Car registration number is not in valid format.`
    });

const optionalRegNumberValidation = (key: string): Joi.StringSchema =>
  Joi.string()
    .optional()
    .regex(/^([0-9A-Z]){2,7}$/)
    .messages({
      "string.base": `Car registration number is not in valid format.`
    });

export {
  idParamValidation,
  stripeIdParamValidation,
  idValidation,
  loginRegisterValidation,
  optionalStringValidation,
  requiredStringValidation,
  requiredRegNumberValidation,
  optionalRegNumberValidation
};
