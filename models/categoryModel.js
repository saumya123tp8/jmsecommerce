import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    ////slugify is a npm package   it can change / in url into -   it helps in seo of website
    slug:{
        type:String,
        lowercase:true
    }
})
export default mongoose.model("Category",categorySchema)
// export default mongoose.model("category",categorySchema)