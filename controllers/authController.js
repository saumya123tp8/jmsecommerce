import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  console.log("ye to chal raha hai");
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validation
    if (!name) {
      return res.send({ message: "Name is required" });
      // return res.send({error:'Name is required'});
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ error: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      return res.status(200).send({
        success: true,
        message: "user email already used please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error generated in registartion",
      error,
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("not email or password");
      return res.status(404).send({
        success: false,
        message: "invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(404).send({
        success: false,
        message: "this email is not register still",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      console.log("password not matches");
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }
    ////token created
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};
///forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "new password is required",
      });
    }

    //now check answer
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong in FP",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  console.log("protectedroute");
  res.send("protected route");
};

//check as admin
//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "unothorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "error in admin middleware",
      error,
    });
  }
};

//update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    ///password
    if (password && password.length < 6) {
      return res.json({
        error: "password is required and more than 6 char long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address,
        phone: phone || user.phone,
        email: email || user.email,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in updating profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in getting order",
      error,
    });
  }
};
//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt:"-1"});
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in getting order",
      error,
    });
  }
};

///order status update controller
export const orderStatusController=async(req,res)=>{
    try{
     const {orderId}=req.params
     const {status}=req.body
     const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
     res.json(orders)
    }catch(error){
        console.log(error);
    res.status(400).send({
      success: false,
      message: "error in getting order",
      error,
    });
    }
}

//4hrs
// import { comparePassword, hashPassword } from "../helpers/authHelper.js";
// import userModel from "../models/userModel.js";
// import JWT from 'jsonwebtoken';

// export const registerController=async(req,res)=>{
//     console.log('ye to chal raha hai')
// try{
// const {name,email,password,phone,address,answer}=req.body;
// // validation
// if(!name){
//     return res.send({message:'Name is required'});
//     // return res.send({error:'Name is required'});
// }
// if(!email){
//     return res.send({message:'email is required'});
// }
// if(!password){
//     return res.send({error:'password is required'});
// }
// if(!phone){
//     return res.send({message:'phone is required'});
// }
// if(!address){
//     return res.send({message:'address is required'});
// }
// if(!answer){
//     return res.send({message:'answer is required'});
// }
// const existinguser=await userModel.findOne({email});
// if(existinguser){
//     return res.status(200).send({
//         success:true,
//         message:'user email already used please login'
//     })
// }

// const hashedPassword=await hashPassword(password);
// //save
// const user=await new userModel(
//     {
//         name,
//         email,
//         phone,
//         address,
//         password:hashedPassword,
//         answer
//     }
//     ).save();
//     res.status(201).send({
//         success:true,
//         message:'user registered successfully',
//         user
//     })
// }catch(error){
//     console.log(error);
//     res.status(500).send({
//         success:false,
//         message:'error generated in registartion',
//         error
//     })
// }

// }

// //login controller
// export const loginController=async (req,res)=>{
//     try{
//      const {email,password}=req.body
//      if(!email||!password){
//         console.log('not emailor password')
//         return res.status(404).send({
//                  success:false,
//                  message:'invalid email or password',
//         })
//      }
//      //check user
//      const user=await userModel.findOne({email});
//      if(!user){
//         console.log('user not found')
//         return res.status(404).send({
//             success:false,
//             message:'this email is not register still'
//         })
//      }
//      const match=await comparePassword(password,user.password);
//      if(!match){
//          console.log('password not matches')
//         return res.status(200).send({
//             success:false,
//             message:'invalid password'
//         })
//      }
//      ////token created
//      const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
//     res.status(200).send({
//         success:true,
//         message:'login successfully',
//         user:{
//             _id: user._id,
//             name:user.name,
//             email:user.email,
//             phone:user.phone,
//             address:user.address
//         },
//         token
//     })
//     }catch(error){
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:'error in login',
//             error
//         })
//     }
// }
// ///forgot password

// export const forgotPasswordController=async(req,res)=>{
// try{
//  const {email,answer,newPassword}=req.body
//  if(!email){
//     res.status(400).send({
//         message:'email is required'
//     })
//  }
//  if(!answer){
//     res.status(400).send({
//         message:'answer is required'
//     })
//  }
//  if(!newPassword){
//     res.status(400).send({
//         message:'new password is required'
//     })
//  }

//  //now check answer
// const user=await userModel.findOne({email,answer})

// if(!user){
//     return res.status(404).send({
//         success:false,
//         message:'wrong email or answer'
//     })
// }
// const hashed=await hashPassword(newPassword)
// await userModel.findByIdAndUpdate(user._id,{password:hashed})
// res.status(200).send({
//     success:true,
//     message:'password reset successfully'
// })
// }catch(error){
//     console.log(error)
//     res.status(500).send({
//         success:false,
//         message:'something went wrong in FP',
//         error
//     })
// }
// }

// //test controller
// export const testController=(req,res)=>{
//     console.log('protectedroute');
//     res.send('protected route');
// }

// //check as admin
// //admin access
// export const isAdmin=async (req,res,next)=>{
//     try{
//         const user = await userModel.findById(req.user._id)
//         if(user.role!==1){
//             return res.status(401).send({
//                 success:false,
//                 message:'unothorized access'
//             })
//         }else{
//             next();
//         }
//     }catch(error){
//         console.log(error);
//         res.status(401).send({
//             success:false,
//             message:'error in admin middleware',
//             error
//         })
//     }
// }
