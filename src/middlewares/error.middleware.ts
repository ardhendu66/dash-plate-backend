import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/GlobalError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'An unexpected error occurred on the server.';

    if(err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } 
    else {
        console.error('UNEXPECTED SERVER ERROR:', err);
    }

    const errorResponse = {
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };

    res.status(statusCode).json(errorResponse);
};

export { errorHandler };