export function handleError(error, req, res, next) {
  console.error(error.message);
  res.status(error.status || 500).json({ message: error.message });
}
