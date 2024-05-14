import dotenv from "dotenv";
import downloader from "image-downloader";
import { rootPath } from "get-root-path";
// import multer from "multer";
import fs from "fs";
import places from "../models/Places.js";
import booking from "../models/booking.js";
import v2 from "../helper/cloudinaryconfig.js";

dotenv.config();

export const uploadbylinkController = async (req, res) => {
  const { link } = req.body;

  // const { files } = req;
  // const uploadPromises = files?.map((file) => v2.uploader.upload(file.path));
  // const uploadRes = await Promise.all(uploadPromises);

  const result = await v2.uploader.upload(link);
  // console.log(result);
  if (result) {
    const { public_id, format, secure_url } = result;

    const fileName = "photo" + Date.now() + `.${format}`;

    res.json({
      file: { publicId: public_id, url: secure_url, name: fileName },
      success: true,
    });
  }

  // await downloader.image({
  //   url: link,
  //   dest: rootPath + "/uploads/" + newName,
  // });
};

export const uploadFilefromDesktop = async (req, res) => {
  try {
    // let uploadedfile = [];

    const { files } = req;
    const uploadPromises = files?.map((file) => v2.uploader.upload(file.path));
    const uploadRes = await Promise.all(uploadPromises);

    const result = uploadRes.map((upload) => {
      return {
        name: upload?.original_filename + `.${upload?.format}`,
        publicId: upload?.public_id,
        url: upload?.secure_url,
      };
    });
    console.log(result);

    if (result) {
      res.json({
        files: result,
        success: true,
      });
    }

    // req.files.forEach((element) => {
    //   const { path, originalname, filename } = element;
    //   const part = originalname.split(".");
    //   let extension = part[part.length - 1];

    //   let newPath = path + "." + extension;
    //   let file = filename + "." + extension;

    //   fs.renameSync(path, newPath);
    //   uploadedfile.push(file);
    // });
    // res.json(uploadedfile);
  } catch (error) {
    res.json({
      error,
      success: false,
      message: "Something wrong",
    });
  }
};

export const createPlacesController = async (req, res) => {
  try {
    const {
      title,
      address,
      description,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      perks,
      photos,
    } = req.body;

    if (
      !title ||
      !address ||
      !description ||
      !extraInfo ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price ||
      !perks ||
      !photos
    ) {
      return res.status(401).send({ message: "Please fill all the fields" });
    }

    const placesDoc = await new places({
      owner: req.user._id,
      title,
      address,
      description,
      extraInfo,
      checkIn: Number(checkIn),
      checkOut: Number(checkOut),
      maxGuests: Number(maxGuests),
      price: Number(price),
      perks,
      photos,
    }).save();

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      user: placesDoc,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPlacesController = async (req, res) => {
  const placesData = await places.find({ owner: req.user._id });
  res.json({
    success: true,
    message: "Data fetched successfully",
    result: placesData,
  });
};

export const getPlaceByidController = async (req, res) => {
  const { id } = req.params;
  const placeData = await places.findById({ _id: id });
  if (placeData) {
    res.json({
      success: true,
      message: "Successfully fetched",
      result: placeData,
    });
  } else {
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const updatePlaceByidController = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    address,
    description,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    perks,
    photos,
  } = req.body;
  const placesDoc = await places.findById({ _id: id });
  console.log(price, typeof price);

  if (req.user._id === placesDoc.owner.toString()) {
    placesDoc.set({
      owner: req.user._id,
      title,
      address,
      description,
      extraInfo,
      checkIn: Number(checkIn),
      checkOut: Number(checkOut),
      maxGuests: Number(maxGuests),
      price: Number(price),
      perks,
      photos,
    });

    await placesDoc.save();
    res.json({ message: "Updated Successfully", success: true });
  }
};

export const getallplacesforhomepageController = async (req, res) => {
  const result = await places.find();
  res.json({
    success: true,
    places: result,
    message: "All places successfully fetched",
  });
};

export const getSingleplaceController = async (req, res) => {
  try {
    const { id } = req.params;
    const placeDoc = await places.findById({ _id: id });
    res.json({
      message: "Single place fetched",
      success: true,
      place: placeDoc,
    });
  } catch (error) {
    res.json({ message: "Something Wrong", success: false });
  }
};

export const bookingController = async (req, res) => {
  try {
    console.log(req?.user);
    const { place, checkIn, checkOut, max0fGuets, name, phone, price } =
      req.body;
    const { _id } = req?.user;
    console.log(req.body);

    if (
      !place ||
      !checkIn ||
      !checkOut ||
      !max0fGuets ||
      !name ||
      !phone ||
      !price
    ) {
      return res.status(401).send({ message: "Please fill all the fields" });
    }

    const bookingDoc = await new booking({
      user: _id,
      place,
      checkIn,
      checkOut,
      name,
      phone,
      price: Number(price),
    }).save();

    res.status(201).json({
      success: true,
      message: "Booking done",
      bookingDetails: bookingDoc,
    });
  } catch (error) {
    res.json({ message: "Something Wrong", success: false });
  }
};

export const getbookingsController = async (req, res) => {
  try {
    const { _id } = req?.user;
    const allbookingsbyUser = await booking
      .find({ user: _id })
      .populate("place");
    res.json({
      success: true,
      message: "Successfully fetched",
      bookings: allbookingsbyUser,
    });
  } catch (error) {
    res.json({ success: false, error });
  }
};

export const getSinglebookingController = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    const bookingdata = await booking.findById({ _id: id }).populate("place");

    console.log("userId", _id);
    console.log("bookingId", id);
    console.log("booking Data", bookingdata);

    if (bookingdata?.user.toString() === _id) {
      res.json({ message: "Ok", success: true, booking: bookingdata });
    }
  } catch (error) {
    res.json({ message: "Something wrong", success: false, error });
  }
};
