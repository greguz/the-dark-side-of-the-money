export class ServerError extends Error {
  constructor (message, statusCode, details) {
    super(message || 'An error occurred')
    Error.captureStackTrace(this, ServerError)
    this.statusCode = statusCode || 500
    this.details = details || {}
  }
}

export class BadRequestError extends ServerError {
  constructor (message, details) {
    super(message || 'Bad Request', 400, details)
  }
}

export class ConflictError extends ServerError {
  constructor (message, details) {
    super(message || 'Conflict', 409, details)
  }
}
