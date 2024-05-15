// Custom error handler class
export class ApplicationError extends Error{
    constructor(statusCode, error) {
        super(error);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);  
      }
}