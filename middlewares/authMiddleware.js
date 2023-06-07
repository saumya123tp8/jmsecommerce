// ///protect routes
// //token comparison


// import JWT from 'jsonwebtoken';
// import userModel from "../models/userModel.js";
// //protected route token base

// export const requireSignIn =async (req,res,next)=>{
//     try{
//         const decode=JWT.verify(
//             req.headers.authorization,
//             process.env.JWT_SECRET
//         );

//         // this error is shown Cannot read properties of undefined (reading '_id')
//         //because we encrypt but further decryption is not done
//         //so we decrypt it
//         req.user=decode;
//         next();
//     }catch(error){
//         console.log(error);
//     }
// }

// //check admin role:1 means is admin

// //admin acceess
// export const isAdmin = async (req, res, next) => {
//     try {
//       // const user = await userModel.findById(req.user._id);
//       const user=await userModel.findById(req.user._id);
//       if (user.role !== 1) {
//         return res.status(401).send({
//           success: false,
//           message: "UnAuthorized Access",
//         });
//       } else {
//         next();
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(401).send({
//         success: false,
//         error,
//         message: "Error in admin middelware",
//       });
//     }
//   };
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};