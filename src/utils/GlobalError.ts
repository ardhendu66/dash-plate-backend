class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

class ConflictError extends ApiError {
    constructor(message = "Resource already exists") {
        super(409, message); // 409 Conflict
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Invalid credentials") {
        super(401, message); // 401 Unauthorized
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(400, message); // 400 Bad Request
    }
}

class ServiceNotFoundError extends ApiError {
    constructor(message = "service not found") {
        super(404, message); // 404 Not Found
    }
}

class ServiceUnavailableError extends ApiError {
    constructor(message = "Service is temporarily unavailable") {
        super(503, message); // 503 Service Unavailable
    }
}

class InvalidObjectIdError extends ApiError {
    constructor(message = "Invalid ID format") {
        super(400, message); // 400 Bad Request
    }
}

class ActionNotAllowedError extends ApiError {
    constructor(message: string) {
        super(403, message);
    }
}

class WebsocketConnectionError extends ApiError {
    constructor(message: string) {
        super(405, message);
    }
}

export { 
    ApiError, 
    ConflictError, 
    UnauthorizedError, 
    BadRequestError, 
    ServiceUnavailableError,
    ServiceNotFoundError , 
    InvalidObjectIdError, 
    ActionNotAllowedError,
    WebsocketConnectionError,
};