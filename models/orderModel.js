// import mongoose from "mongoose";

// const orderSchema=new mongoose.Schema({
//    products:[
//     {
//         type:mongoose.ObjectId,
//         ref:'Product',..............................................

//     },
//    ],
//    payment:{},
//    buyer:{
//     type:mongoose.ObjectId,
//     ref:'User'.......................................................check from model
//    },
//    status:{
//     type:String,
//     default:"Not Process",
//     enum:["Not Processed","Processing","Shipped","delivered","cancel"]
//    }
// },
// {timestamps:true})
// export default mongoose.model("Order",orderSchema)
// // export default mongoose.model("category",categorySchema)
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);