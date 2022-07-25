const logger = require('./logger')

const requestLogger = (request, _, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('---------------------------------')
  next()
}

const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const serverURL = (request, _, next) => {
  logger.info('Server URL: ', request.protocol + '://' + request.get('host') + request.originalUrl)
  next()
}

const errorHandler = (error, _, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'Malformatted id',
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'Invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'Token expired',
    })
  }

  logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  serverURL,
  errorHandler,
  tokenExtractor,
}
