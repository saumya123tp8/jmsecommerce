//  import express from 'express'
// import { isAdmin } from '../controllers/authController'
// import { requireSignIn } from '../middlewares/authMiddleware'
// import { createCategoryController } from '../controllers/categoryController'

// const router =express.Router()

// router.post('create-category', requireSignIn ,isAdmin,createCategoryController)

// export default router
// //  imposrt {isAdmin}
import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryControlller,
//   categoryControlller,
  createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController,
//   deleteCategoryCOntroller,
//   singleCategoryController,
//   updateCategoryController,
} from "./../controllers/categoryController.js";

const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  ///id is passed which help to update dyanamically
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//getALl category
router.get("/get-category", categoryControlller);

//single category
// router.get("/single-category/:id", singleCategoryController);
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

export default router;