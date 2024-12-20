import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return next(new Error("No token provided", { cause: 401 }))

  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.user = decoded;
    // console.log(decoded)
    next();
  } catch {
    return next(new Error("Invalid or expired token", { cause: 401 }))
  }
}

export default auth;