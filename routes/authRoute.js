import  express  from 'express';
import {registerController,loginController,testController, isAdmin, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
import { requireSignIn } from '../middlewares/authMiddleware.js';
//router object

const router=express.Router()

// routing

//register
router.post('/register',registerController)

//login 
router.post('/login',loginController)

//forgot password||post
router.post('/forgot-password',forgotPasswordController)


//test
router.get('/test',requireSignIn,isAdmin,testController)

//protected route--user role 0
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});



//protected route--admin role 1
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});


//update profile
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)

//all orders
router.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController)

//order status update
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController)

export default router


//4 hrs
// import  express  from 'express';
// import {registerController,loginController,testController, isAdmin, forgotPasswordController} from '../controllers/authController.js'
// import { requireSignIn } from '../middlewares/authMiddleware.js';
// //router object

// const router=express.Router()

// // routing

// //register
// router.post('/register',registerController)

// //login 
// router.post('/login',loginController)

// //forgot password||post
// router.post('/forgot-password',forgotPasswordController)


// //test
// router.get('/test',requireSignIn,isAdmin,testController)

// //protected route
// router.get('/user-auth',requireSignIn,(req,res)=>{
//     res.status(200).send({ok:true});
// });

// export default router
