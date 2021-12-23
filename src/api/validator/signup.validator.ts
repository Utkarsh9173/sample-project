import { idValidation, requiredStringValidation } from "./common";
import Joi from "@hapi/joi";
import { strict } from "yargs";

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
  time: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid("Low", "High", "Medium"),
  type: Joi.string().valid("Birthday", "Anniversaries", "Holiday", "Other"),
});

const updateReminder = reminder.append({
  id: Joi.string().required(),
  status: Joi.number().valid(0, 1, 2),
});

const getReminder = Joi.object({
  user_id: Joi.string().required(),
  date: Joi.date().optional(),
  status: Joi.number().optional(),
});

const deleteReminder = Joi.object({
  id: Joi.string().required(),
});


export {
  idParamValidation,
  signupValidator,
  rejectValidation,
  signinValidator,
  reminder,
  updateReminder,
  deleteReminder,
  getReminder,
};
