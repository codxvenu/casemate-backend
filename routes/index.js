import { Router } from "express";
import fileRouter from "./files.js"
import db from "../config/db.js";
const router = Router()


router.use("/files",fileRouter)
router.get("/",async(req,res)=>{
   const [row] = await db.query("select 1+1");
   return res.status(200).json({message : row})
})
export default router