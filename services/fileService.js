import path from "path";
import { constants } from "../config/constants.js";
import db from "../config/db.js";
import { env } from "../config/env.js";
import { RandomfileName } from "../utils/RfileName.js";
import crypto from "crypto";
import fs, { rename } from "fs";
import { dbService } from "./dbService.js";
import jwt from "jsonwebtoken";
import { CreateSecretSha256 } from "../utils/createSecret.js";
export const FileService = {
  async upload(data) {
    const id = await dbService.createFileRecord(data);
    return { success: true, message: "file uploaded", id };
  },
  async createDir(name, id, userId) {
    await dbService.CreateFolder({ userId, id, name });
    return { success: true, message: "Directory Created" };
  },
  async deletefile(id, userId) {
    const [file] = await dbService.DeleteFileRecord({ userId, id });
    if (file.affectedRows === 0) throw Error("file not exits");

    const storedName = file[0].storedName;
    console.log("error one")
    const filepath = path.join(constants.file_path, userId, storedName);
    console.log("error two")
    fs.unlinkSync(filepath);
    await dbService.DeleteFileRecord({ userId, id });

    return { success: true, message: "File Deleted" };
  },
  async renamefile(id, userId, name) {
    await dbService.RenameFileRecord({ userId, id, name });
    return { success: true, message: "File Renamed" };
  },
  // async ShareFile(id,userId,name){
  //     try {
  //         const [rows] = await db.query("insert into shared",[name,userId,id]);
  //         if(rows.affectedRows === 0) return {success : "false",error : ""}
  //         return {success : true,message : "File Deleted"}
  //     } catch (error) {
  //          return {success : "false" , error : error.message}
  //     }
  // },
  async previewfile(name,userId) {
    const secret = CreateSecretSha256(name);
    const url = `https://api.casemate.icu/signed/?user=${userId}&file=${name}&expires=${secret.expiry}&signature=${secret.signature}`;
    return { success: true, url };
  },
  async share(fileId, filename, userId,allowedUsers,sharetype) {
    const data = {
      fileId,
      filename,
      userId,
      mode: sharetype,
      allowedUsers,
    };
    const token = jwt.sign(data, env.jwtSecret);
    await dbService.addShare({fileId, userId, token});
    
    return { status: true, message: "Share token generated" ,token : token};
  },
  async addShareUser(fileId, userId, sharedToUserId) {
    const oldtoken = await dbService.getShare(fileId, userId);
    const oldData = jwt.verify(oldtoken, env.jwtSecret);
    if(oldData.allowedUsers.includes(sharedToUserId)){
        return {success : false,message  : "User Already Has access"}
    }
    if(!oldData.allowedUsers.includes(sharedToUserId)){
        oldData.allowedUsers.push(sharedToUserId);
    }
    const token = jwt.sign(oldData, env.jwtSecret);
    await dbService.updateShare(fileId, token, userId);
    return { status: true, message: "User added to guest" };
  },
  async getFileAccess(userId, token) {
    const data = jwt.verify(token, env.jwtSecret);
    const dbtoken = await dbService.getShare({ fileId: data.fileId});
    if(token !== dbtoken) return {status : false , message : "Access Revoked"}
    if (data.mode === "public"){
        return FileService.previewfile(data.filename,data.userId);
    }
     if(data.mode === "guest" ){
        if(data.allowedUsers.includes(userId) || data.userId === userId){
        return FileService.previewfile(data.filename,data.userId);
        }
    }
    return {status : false,error : "Access Denied"}
  },
};
