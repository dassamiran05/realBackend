import userModel from "../models/userModels.js";
import {
  // compareOTP,
  comparePassword,
  hashPassword,
} from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validations
    if (!name || !email || !password) {
      return res.json({
        message: "Please fill all the field",
        success: false,
      });
    }

    //check user
    const existingUser = await userModel.findOne({
      email,
    });

    //check existing user
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Already registered please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    const { password: pass, ...result } = user.toObject();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//Login post
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validations
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the field",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not registered",
      });
    }

    const match = await comparePassword(password, user?.password);

    if (match) {
      //Token Generation

      JWT.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;

          res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
              name: user?.name,
              email: user?.email,
            },
            token,
          });
        }
      );
    } else {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
