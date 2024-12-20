import jwt from "jsonwebtoken";

export const genrateAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role
  }
  const token = jwt.sign(
    payload, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "1h" }
  )
  return token;
}