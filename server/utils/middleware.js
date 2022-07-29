const logger = require('./logger')

const requestLogger = (req, _, next) => {
  logger.info('=================================================================================================')
  logger.info('Method: ', req.method)
  logger.info('Server URL: ', req.protocol + '://' + req.get('host') + req.originalUrl)
  logger.info('Path: ', req.path)
  next()
}

const tokenExtractor = (req, _, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
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
  errorHandler,
  tokenExtractor,
}
