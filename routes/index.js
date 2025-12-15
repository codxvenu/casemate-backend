import { Router } from "express";
import fileRouter from "./files.js"
const router = Router()


router.use("/files",fileRouter)
router.get("/",(req,res)=>{
    throw Error("working")
})
export default router