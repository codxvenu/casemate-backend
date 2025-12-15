import jwt from "jsonwebtoken"
import { env } from "../config/env.js";
 export async function authMiddleware(req, res, next) {
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