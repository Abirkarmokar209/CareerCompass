// Keeps route handlers thin: throw { status, message } and this formats the response.
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on our end. Please try again.';
  res.status(status).json({ message });
}

module.exports = { errorHandler };
