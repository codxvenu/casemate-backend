import multer from "multer";
import path from "path";
import { env } from "../config/env.js";
import fs from "fs"
import { RandomfileName } from "../utils/RfileName.js";
import { constants } from "../config/constants.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(env?.uploadPath, `${req.user.id}`);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const safename = file.originalname.replace(/[\s()]+/g, "_");
    const storedName = RandomfileName(safename)
    req.storedName = storedName
    req.type = path.extname(file.originalname)
    cb(null, storedName); 
  },
});
const fileFilter = (req,file,cb)=>{
  const ext = path.extname(file.originalname).toLowerCase();
  if(constants.allowed_files.includes(ext)) return cb(null,true)
  return cb(new Error("invalid file extension"),false)
}
export const upload = multer({
  storage,
  limits: { fileSize: 800 * 1024 * 1024 },
  fileFilter,
});
