import Joi from "joi";
import STATUS_CODES from "../utils/statusCode.js";

const userSchema = Joi.object({
  name: Joi.string().min(0).max(20).required().messages({
    "string.base": "firstName should be a string",
    "string.empty": "firstName cannot be empty",
    "string.min": "firstName should have a minimum length of {#limit}",
    "string.max": "firstName should have a maximum length of {#limit}",
    "any.required": "firstName is required",
  }),
  // lastName: Joi.string().min(0).max(20).required().messages({
  //   "string.base": "lastName should be a string",
  //   "string.empty": "lastName cannot be empty",
  //   "string.min": "lastName should have a minimum length of {#limit}",
  //   "string.max": "lastName should have a maximum length of {#limit}",
  //   "any.required": "lastName is required",
  // }),

  email: Joi.string().required().messages({
    "string.base": "email should be a string",
    "string.empty": "email cannot be empty",
    "string.min": "email should have a minimum length of {#limit}",
    "string.max": "email should have a maximum length of {#limit}",
    "any.required": "email is required",
    "string.email": "",
  }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.base": "password should be a string",
    "string.empty": "password cannot be empty",
    "string.min": "password should have a minimum length of {#limit}",
    "string.max": "password should have a maximum length of {#limit}",
    "any.required": "password is required",
  }),
  // date: Joi.string().min(2).max(4).required().messages({
  //   "string.base": "date should be a string",
  //   "string.empty": "date cannot be empty",
  //   "string.min": "date should have a minimum length of {#limit}",
  //   "string.max": "date should have a maximum length of {#limit}",
  //   "any.required": "date is required",
  // }),
});

const journalSchema = Joi.object({
  drinkId: Joi.string().required().messages({
    "string.base": "drinkId should be a string",
    "string.empty": "drinkId cannot be empty",
    "any.required": "drinkId is required",
  }),
  userId: Joi.string().required().messages({
    "string.base": "userId should be a string",
    "string.empty": "userId cannot be empty",
    "any.required": "userId is required",
  }),
});

const validateSchema = (schema, isRequired = false) => {
  return (req, res, next) => {
    const { error } = isRequired
      ? schema.required().validate(req.body)
      : schema.validate(req.body);

    if (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        msg: error.details[0].message,
      });
    }

    next();
  };
};

const validatePostUser = validateSchema(userSchema, true);
const validatePutUser = validateSchema(userSchema);
const validatePostJournal = validateSchema(journalSchema, true);
const validatePutJournal = validateSchema(journalSchema);

export {
  validatePostUser,
  validatePutUser,
  validatePostJournal,
  validatePutJournal,
};