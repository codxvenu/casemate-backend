import { Router } from "express";
import { FileService } from "../services/fileService.js";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/auth.js";
import asyncHandler from "express-async-handler"
import { validator } from "../middleware/validators.js";
import { CreateFolderSchema, deleteSchema, PreviewSchema, RenameSchema, uploadSchema,AddShareSchema, getFileAccessSchema } from "../validator/file.schema.js";

const router = Router()
router.use(authMiddleware)
router.post("/upload",upload.single("file"),validator(uploadSchema),asyncHandler(async(req,res)=>{
    const fileData = req?.validated?.body.fileData;
    const userId = req?.validated?.userId
    const storedName = req?.storedName
    const type = req?.type
    const result = await FileService.upload({...fileData,userId,storedName,type})
    res.status(200).json(result)
}))
router.get("/createDir",validator(CreateFolderSchema),asyncHandler(async(req,res)=>{
    const {folderId,name} = req?.validated.query;
    const result = await FileService.createDir(name,folderId,req.user.id)
    
    res.status(200).json(result)
}))
router.get("/delete",validator(deleteSchema),asyncHandler(async(req,res)=>{
    const {fileId} = req?.validated.query;
    const result = await FileService.deletefile(fileId,req.user.id)
    res.status(200).json(result)
}))
router.get("/rename",validator(RenameSchema),asyncHandler(async(req,res)=>{
    console.log(req.validated)
    const {fileId,name} = req?.validated?.query;
    const result = await FileService.renamefile(fileId,req.user.id,name)
    res.status(200).json(result)
}))
router.get("/previewFile",validator(PreviewSchema),asyncHandler(async(req,res)=>{
    const {name} = req?.validated.query
    const result = await FileService.previewfile(name)
    
    res.status(200).json(result)
}))
router.post("/share",validator(AddShareSchema),asyncHandler(async(req,res)=>{
    console.log(req.body)
    const fileId = req.validated.body.fileId;
    const allowedUsers = req.validated.body.allowedUsers;
    const filename = req.validated.body.filename;
    const sharetype = req.validated.body.sharetype;
    const userId = req.validated.userId
    const result = await FileService.share(fileId,filename,userId,allowedUsers,sharetype)
    res.status(200).json(result)
}))
router.get("/addShareUser",asyncHandler(async(req,res)=>{
    const fileId = req.validated.body.fileId;
    const userId = req.validated.userId
    const sharedToUserId = req.validated.sharedToUserId
    const result = await FileService.addShareUser(fileId,userId,sharedToUserId)
    res.status(200).json(result)
}))
router.get("/guest",validator(getFileAccessSchema),asyncHandler(async(req,res)=>{
    const token = req.validated.query.token;
    const userId = req.validated.userId
    const result = await FileService.getFileAccess(userId,token)
    res.status(200).redirect(result?.url)
}))

export default router