const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // we could use lodash but minimize library use global is-empty function
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirm_password = !isEmpty(data.confirm_password)
    ? data.confirm_password
    : "";

  if (!Validator.isLength(data.first_name, { min: 2, max: 30 })) {
    errors.first_name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = "Name field is required";
  }

  if (!Validator.isLength(data.last_name, { min: 2, max: 30 })) {
    errors.last_name = "Name must be between 2 and 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isMobilePhone(data.phone_number, ["en-IN"])) {
    errors.phone_number = "Phone number is invalid";
  }

  if (Validator.isEmpty(data.phone_number)) {
    errors.phone_number = "Phone Number field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = "Confirm Password field is required";
  } else {
    if (!Validator.equals(data.password, data.confirm_password)) {
      errors.confirm_password = "Passwords must match";
    }
  }

  // returning errors object and error is Valid or not

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
