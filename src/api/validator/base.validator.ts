import { SocialPlatforms } from "@database/enum/user";
import Joi, { optional } from "@hapi/joi";
// import { newCar } from "./car.validator";
import { loginRegisterValidation, requiredStringValidation } from "./common";

const login = loginRegisterValidation;
const register = loginRegisterValidation.append({
  firstName: requiredStringValidation("firstName"),
  lastName: requiredStringValidation("lastName"),
  dob: requiredStringValidation("dob"),
  marketing: Joi.optional()
});

const resetPassword = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "email must be a string",
      "string.email": "Email is invalid",
      "any.required": "email is required"
    })
});

const verifyOtp = Joi.object({
  id: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.base": "id must be a string",
      "any.required": "id is required",
      "string.guid": "invalid id format"
    }),
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      "any.required": "otp is required",
      "string.base": "otp must be a string",
      "string.length": "otp must be a 6-digit long"
    })
});

const updatePassword = Joi.object({
  id: Joi.string()
    .uuid({ version: "uuidv4" })
    .required()
    .messages({
      "string.base": "id must be a string",
      "any.required": "id is required",
      "string.guid": "invalid id format"
    }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "string.base": "password must be a string",
      "any.required": "password is required",
      "string.min": "password must be 8 characters long"
    }),
  confirmPassword: Joi.string()
    .min(8)
    .required()
    .equal(Joi.ref("password"))
    .messages({
      "string.base": "confirm password must be a string",
      "any.only": "password and confirm password do not match",
      "any.required": "confirm password is required",
      "string.min": "password must be 8 characters long"
    })
});

const accountSetup = Joi.object({
  profile: Joi.object({
    firstName: requiredStringValidation("firstName"),
    lastName: requiredStringValidation("lastName"),
    phoneCode: requiredStringValidation("phoneCode"),
    contact: Joi.number()
      .integer()
      .required()
      .messages({
        "any.required": "contact is required",
        "number.base": "contact must be a number",
        "number.integer": "contact must be an integer"
      }),
    isAccountSetup: Joi.boolean(),
    isMemberSociety: Joi.boolean()
  }).required(),
  paymentCard: Joi.array().allow(null, "")
  //car: newCar.optional().allow(null, "")
});

const socialLogin = Joi.object({
  email: Joi.when("socialPlatform", {
    is: SocialPlatforms.Google,
    then: Joi.string()
      .email()
      .required()
      .messages({
        "string.base": "email must be a string",
        "string.email": "Email is invalid",
        "any.required": "email is required"
      }),
    otherwise: Joi.string()
      .email()
      .optional()
      .allow(null, "")
      .messages({
        "string.base": "email must be a string",
        "string.email": "Email is invalid"
      })
  }),
  socialPlatform: Joi.string()
    .valid(...Object.values(SocialPlatforms))
    .required()
    .messages({
      "string.base": "social platform must be a string",
      "any.required": "social platform is required",
      "any.only": "social platform must be one of [google, apple]"
    }),
  socialPlatformId: requiredStringValidation("social platform id"),
  identityToken: Joi.string().when("socialPlatform", {
    is: SocialPlatforms.Apple,
    then: Joi.required().messages({
      "string.base": "identityToken must be a string",
      "any.required": "identityToken is required"
    }),
    otherwise: Joi.optional().messages({
      "string.base": "identityToken must be a string"
    })
  })
});

export {
  accountSetup,
  login,
  register,
  resetPassword,
  socialLogin,
  updatePassword,
  verifyOtp
};
