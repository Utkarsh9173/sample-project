import { idValidation, requiredStringValidation } from "./common";
import Joi from "@hapi/joi";

const idParamValidation = Joi.object({
  id: idValidation("id"),
});

const signupValidator = Joi.object({
  email: Joi.string().email().message("Not A valid Email"),
  password: requiredStringValidation("password").min(6).max(10),
  Name: requiredStringValidation("Name"),
});

const rejectValidation = Joi.object({
  email: requiredStringValidation("email"),
  reason: requiredStringValidation("reason"),
});

const signinValidator = Joi.object({
  email: Joi.string().email().message("Not A valid Email"),
  password: requiredStringValidation("password").min(6).max(10),
 
});


const reminder = Joi.object({
  date: Joi.string().required(),
  description: Joi.string().required(),
});


export { idParamValidation, signupValidator, rejectValidation ,signinValidator,reminder};
