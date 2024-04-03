const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(err)
}

const errorsHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err)
  }

  res.status(err.code || 500).json({message: err.message || 'An unknow error occured'})
}

module.exports = {notFound, errorsHandler}