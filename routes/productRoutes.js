import express from 'express';
// import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import { brainTreePaymentController,  braintreeTokenController, confirmProductController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router=express.Router()

///routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)


//get product
router.get('/get-product',getProductController);

///GET SINgle product
router.get('/get-product/:slug',getSingleProductController);

//get photo
router.get('/product-photo/:pid',productPhotoController)


//delete product
router.delete('/delete-product/:pid',deleteProductController)

///////////////tony/////
//confirm product
router.delete('/confirm-order/:pid',confirmProductController)

///update product details
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)


//filter product
router.post('/product-filters',productFiltersController)
//we can not pass the value into get so we use post here
// router.get('/product-filters',productFiltersController)

//count   pagination
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController);

//search base filter
router.get('/search/:keyword',searchProductController)

//similiar product
router.get('/related-product/:pid/:cid',relatedProductController)


// category wise product
router.get('/product-category/:slug',productCategoryController);



//payment routes
//token
// router.get('/braintree/token',braintreeTokenController)
router.get("/braintree/token", braintreeTokenController);

//payments
router.post('/braintree/payment',requireSignIn,brainTreePaymentController)
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router