import { error } from "./index";

export { errorHandler };

function errorHandler(err, res) {
  if (typeof err === "string") {
    // custom application error
    const is404 = err.toLowerCase().endsWith("not found");
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ ...error, message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({
      ...error,
      message: "Invalid Token",
      error: { ...error.error, code: 401 },
    });
  }

  // default to 500 server error
  console.error(err);
  return res.status(500).json({ ...error, message: err.message });
}
