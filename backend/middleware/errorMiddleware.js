// URL:er eller rutter som inte finns
// fångar upp URL:er/routrar som inte finns (404)
export const notFoundEndpoint = (req, res, next) => {
  res.status(404).json({
    message: `Not found - ${req.originalUrl}`
  });
};

// middleware för error
// skickar statuskod och felmeddelande till klienten
export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Kolla error.code först (där HttpError brukar spara statuskoden)
  const statusCode = error.code || error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message: error.message || "An unknown error occured."
  });
};