export const validator =(schema)=> (req,res,next)=>{
    if(typeof req?.body?.fileData === "string" && req?.body?.fileData){ 
        req.body.fileData = JSON.parse(req?.body?.fileData)
    }
    try {
        console.log(req.body);
        
    const validate = schema.parse({
        body : req.body,
        params : req.params,
        query : req.query,
        userId : req?.user?.id
    })
    console.log(validate);
    
    req.validated = validate
    next()   
    } catch (error) {
        next(error)
    }
}