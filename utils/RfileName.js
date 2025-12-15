import crypto from "crypto";
import path from "path";

export function RandomfileName(filename){
    const now = Date.now()
    const ext = path.extname(filename)
    const Rstring = crypto.randomBytes(8).toString("hex")
    return `${now}-${Rstring}${ext}`
}