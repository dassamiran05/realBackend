import express from "express";
import { requireSignin } from "../middlewares/authMiddleware.js";
import {
  bookingController,
  createPlacesController,
  getPlaceByidController,
  getPlacesController,
  getSinglebookingController,
  getSingleplaceController,
  getallplacesforhomepageController,
  getbookingsController,
  updatePlaceByidController,
  uploadFilefromDesktop,
  uploadbylinkController,
} from "../controller/productController.js";
import multer from "multer";

const router = express.Router();



router.post(
  "/upload-by-link",
  // requireSignin,
  // isAdmin,
  // formidable(),
  uploadbylinkController
);

const photosMiddleware = multer({ dest: "uploads/" });
router.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  uploadFilefromDesktop
);

router.post("/createplace", requireSignin, createPlacesController);

// Get all places
router.get("/places", requireSignin, getPlacesController);
router.get("/getplace/:id", getPlaceByidController);
router.put("/updateplace/:id", requireSignin, updatePlaceByidController);
router.get("/indexplaces", getallplacesforhomepageController);
router.get("/singleplace/:id", getSingleplaceController);
router.post("/booking", requireSignin, bookingController);
router.get("/allbooking", requireSignin, getbookingsController);
router.get("/booking/:id", requireSignin, getSinglebookingController);

export default router;
