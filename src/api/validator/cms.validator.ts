import { loginRegisterValidation } from "./common";
import Joi from "@hapi/joi";

const cmsUser = loginRegisterValidation;

const updateBookingStatus = Joi.object({
  bookingId: Joi.number()
    .integer()
    .required()
    .messages({
      "any.required": "id is required",
      "number.base": "id must be a number",
      "number.integer": "id must be an integer",
    })
});

export { 
  cmsUser,
  updateBookingStatus 
};
