import jwt from "jsonwebtoken"
import { env } from "../config/env.js";
import { constants } from "../config/constants.js";
 export async function authMiddleware(req, res, next) {
  if(constants.public_routes.includes(req.path)) return next()
  const token = req?.cookies?.token;
  if (!token) return res.status(401).json({ error: "user not authenticated" });
  try {
    req.user = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "User Not authenticated" });
  }finally{
    next();
  }
}