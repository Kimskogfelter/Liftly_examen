// URL:er eller rutter som inte finns
// fångar upp URL:er/routrar som inte finns (404)
export const notFoundEndpoint = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

// middleware för error
// skickar statuskod och felmeddelande till klienten
export const errorHandler = (error, req, res, next) => {

    if(res.headerSent) {
        return next(error);
    } 

    res.status(error.code || 500).json({message: error.message || "An unknown error occured."})
}