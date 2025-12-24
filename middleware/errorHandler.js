export async function erroHandler(err,req,res,next) {
    console.log("Got a err : "+ err ,"from :"+req.path)
    if(err.name === "ZodError"){
     return res.status(400).json({
        success : false,
        message : err?.errors[0].message,
        details : err?.errors
    })
    }
    return res.status(500).json({
        success : false,
        message : err.message || "internal Server Error"
    })
}