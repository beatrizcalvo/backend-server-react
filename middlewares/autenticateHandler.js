require("dotenv").config();

const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

const errorMessages = require("../constants/errorConstants");
const userDBController = require("../db/controllers/userDBController");

const autenticateHandler = (req, res, next) => {
  / Get the token from the Authorization header and validate
  const authToken = req.headers.authorization;
  
  if (!authToken || !authToken.toLowerCase().startsWith("bearer ")) 
    return next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));

  // Split the token to remove the "Bearer " part
  const token = authToken.split(" ")[1];

  try {
    // Verify the token and check if the user exists. Any error will return code 401
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    
  } catch (error) {
    next(createHttpError(401, JSON.stringify([errorMessages.AUTH_API_F_0007()])));
  }
};

module.exports = autenticateHandler;
