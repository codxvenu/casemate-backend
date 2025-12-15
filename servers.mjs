import express from "express"
import routes from "./routes/index.js"
import { erroHandler } from "./middleware/errorHandler.js"
import cors from "cors"
import { env } from "./config/env.js"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin : [env.frontend_url],credentials : true }))


app.use("/api",routes)
app.use(erroHandler)

app.listen(3001,()=>{
    console.log("server started")
})