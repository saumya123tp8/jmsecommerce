import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
// import categoryRoutes from './routes/categoryRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path'
///enable cors
import cors from 'cors'
//config env
dotenv.config();
//db config
connectDB();

//rest obj
const app=express()

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')))

//rest api create


app.use('/api/v1/auth/',authRoutes)
app.use('/api/v1/category/',categoryRoutes)
app.use('/api/v1/product/',productRoutes)


// app.get('/',(req,res)=>{
//  res.send("<h1>jai maa shakti har har mahadev</h1>")
// })

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
const PORT=process.env.PORT||8080

//run listen
app.listen(PORT,()=>{
console.log(`server is running on port :${PORT}`.bgCyan.white);
})