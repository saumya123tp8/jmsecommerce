import mongoose from 'mongoose'
import colors from 'colors';
const connectDB = async ()=>{
  try {
      const conn=await mongoose.connect(process.env.MONGO_URL)
      // console.log("something")
    // const conn=await mongoose.connect(process.env.MONGO_URL)
      // console.log(`${conn.connection.host}`)
      console.log(`connect to mongodb database ${conn.connection.host}`.bgMagenta.white)
    } catch(error){
      // console.log("something")
      console.log(`errore in db.js:${error}`)
    }
}

export default connectDB