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

  res.status(error.status || 500).json({
    message: error.message || "An unknown error occured."
  });
};