import db from "../config/db.js"

export const dbService = {
   async createFileRecord({originalName,storedName,type,size,created_at,folderId,userId}){
        const [rows] = await db.query("insert into files(originalName,storedName,type,size,created_at,folderId,userId) values (?,?,?,?,?,?,?)",[originalName,storedName,type,size,created_at,folderId,userId]);
        return rows.insertId
    },
   async DeleteFileRecord({userId,id}){
        const [rows] = await db.query("delete from files where userId = ? and fileId = ?",[userId,id]);
        return rows.affectedRows
    },
   async CreateFolder({userId,id,name}){
         const [rows] = await db.query("insert into folder(name,parentId,userId) values(?,?,?)",[name,id,userId]);
        return rows.insertId
    },
   async RenameFileRecord({userId,id,name}){
         const [rows] = await db.query("update files set originalName = ? where userId = ? and fileId = ?",[name,userId,id]);
        return rows.affectedRows
    },
   async getFileRecord({id}){
         const [rows] = await db.query("select * from files where fileId = ?",[id]);
        return rows.affectedRows
    },
   async addShare({fileId,userId,token}){
         const [rows] = await db.query("insert into share(fileId,userId,token,created_at) values(?,?,?,?)",[fileId,userId,token,new Date()]);
        return rows.affectedRows
    },
   async getShare({fileId,userId}){
         const [rows] = await db.query("select token from share where fileId = ?",[fileId]);
        return rows[0].token
    },
   async updateShare({fileId,userId,token}){
         const [rows] = await db.query("update share set token = ? where userId = ? and fileId = ?",[token,userId,fileId]);
        return rows.affectedRows
    },
    

}