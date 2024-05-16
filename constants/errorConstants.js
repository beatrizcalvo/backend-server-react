const AUTH_API_F_0001 = function (field) {
  return {
      code: "AUTH_API-F-0001",
      level: "error",
      message: "Mandatory input missing",
      description: "Input field " + field + " is mandatory"
  };
};

const AUTH_API_F_0002 = function (field) {
  return {
    code: "AUTH_API-F-0002",
    level: "error",
    message: "Invalid input format",
    description: "Input field " + field + " format is not correct"
  };
};

const AUTH_API_F_0003 = function (field, min) {
  return {
    code: "AUTH_API-F-0003",
    level: "error",
    message: "Invalid imput size",
    description: "Input field " + field + " length must be at least " + min + " characters long"
  };
};

const AUTH_API_F_0004 = function (field) {
  return {
    code: "AUTH_API-F-0004",
    level: "error",
    message: "Not allowed input",
    description: "Input field " + field + " is not allowed"
  };
};

const AUTH_API_F_0005 = function () {
  return {
    code: "AUTH_API-F-0005",
    level: "error",
    message: "Application login error",
    description: "Email not found"
  };
};

const AUTH_API_F_0006 = function () {
  return {
    code: "AUTH_API-F-0006",
    level: "error",
    message: "Unauthorized",
    description: "Passwords does not match"
  };
};

const AUTH_API_F_0007 = function () {
  return {
    code: "AUTH_API-F-0007",
    level: "error",
    message: "Unauthorized",
    description: "Invalid access token"
  };
};

const AUTH_API_F_0008 = function () {
  return {
    code: "AUTH_API-F-0008",
    level: "error",
    message: "Not found",
    description: "No user found for that id"
  };
};

const AUTH_API_F_0009 = function () {
  return {
    code: "AUTH_API-F-0009",
    level: "error",
    message: "Unauthorized",
    description: "The user is not active, please contact the administrator"
  }
};

const AUTH_API_F_0010 = function (field, validValues) {
  return {
    code: "AUTH_API-F-0010",
    level: "error",
    message: "Bad Request - wrong value",
    description: "Input field " + field + ": Value does not belong to the admitted range. Valid values: " + validValues
  }
};

const AUTH_API_F_0011 = function () {
  return {
    code: "AUTH_API-F-0011",
    level: "error",
    message: "Not Found",
    description: "No nationality found for that code"
  }
};

const AUTH_API_F_0012 = function () {
  return {
      code: "AUTH_API-F-0012",
      level: "error",
      message: "Mandatory input missing",
      description: "No fields have been indicated to update the resource"
  };
};

const AUTH_API_T_0001 = function (descriptionError) {
  return {
    code: "AUTH_API-T-0001",
    level: "error",
    message: "Internal Server Error",
    description: descriptionError
  };
};

const AUTH_API_T_0002 = function (descriptionError) {
  return {
    code: "AUTH_API-T-0002",
    level: "error",
    message: "Error creating user",
    description: descriptionError
  };
};

module.exports = { 
  AUTH_API_F_0001, AUTH_API_F_0002, AUTH_API_F_0003, AUTH_API_F_0004, AUTH_API_F_0005, AUTH_API_F_0006, 
  AUTH_API_F_0007, AUTH_API_F_0008, AUTH_API_F_0009, AUTH_API_F_0010, AUTH_API_F_0011, AUTH_API_F_0012, 
  AUTH_API_T_0001, AUTH_API_T_0002
};
