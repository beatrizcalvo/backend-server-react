const errorMessages = require("../constants/errorConstants");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const responseBody = (statusCode === 500 && !err.message.includes("AUTH_API-")
                        ? { errors: [errorMessages.AUTH_API_T_0001(err.message.replaceAll('"', "'"))] } 
                        : { errors: JSON.parse(err.message) });
  
  console.error(req.method + " " + req.originalUrl + 
                ((Object.keys(req.body).length !== 0) ? (" ## Request Body: " + JSON.stringify(req.body)) : "") + 
                " || Response Status: " + statusCode + " ## Response Body: " + JSON.stringify(responseBody));
  
  res.status(statusCode).send(responseBody);
};

module.exports = errorHandler;
