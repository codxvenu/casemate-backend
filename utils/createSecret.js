import {constants} from "../config/constants.js";
import {createHmac} from "crypto"
import { env } from "../config/env.js";
export function CreateSecretSha256(data){
const expiry = Date.now() + constants.EXPIRE_TIME_1MIN;
const secret = createHmac("sha256",env.jwtSecret).update(data+expiry).digest("hex")
return {signature : secret,expiry}
}