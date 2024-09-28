import bcrypt from "bcryptjs";
import User from "../modals/user.model.js";
import jwt from "jsonwebtoken";
import Post from "../modals/post.model.js";
export const register = async (req, res) => {
  try {
    const { fullName, email, password, avatar } = req.body;
    console.log(avatar);
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "FullName, Email, Password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    //Check if user already exists in db or not
    if (user) {
      return res.status(400).json({
        message: "User with this email id already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      avatar: avatar,
    });

    // console.log(newUser);
    return res.status(201).json({
      message: "Registration is successfull .",
      success: true,
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong.", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email, Password are required.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email.",
        success: false,
      });
    }

    const isPsswordMatched = await bcrypt.compare(password, user?.password);
    if (!isPsswordMatched) {
      return res.status(400).json({
        message: "Incorrect password.",
        success: false,
      });
    }

    // Code to generate and pass token as cookie to browser

    const tokenData = { userId: user?._id };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      id: user?._id,
      fullName: user?.fullName,
      email: user?.email,
      avatar: user?.avatar,
    };
    return res
      .status(201)
      .cookie("authToken", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged in successfully.",
        user,
        token,
        success: true,
      });
  } catch (error) {
    console.log("Failed to log in.");
    return res.status(500).json({
      message: "Failed to log in. Something went wrong.",
      success: false,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    return res.status(201).cookie("authToken", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log("Failed to log out.");
    return res.status(400).json({
      message: "Failed to log out. Something went wrong.",
      success: false,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, avatar } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({
        message: "fullName is required",
        success: false,
      });
    }
    // From middleware
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        avatar,
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        message: "User with this id doesn't exist",
        success: false,
      });
    }

    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };

    // console.log(user);
    return res.status(201).json({
      message: "Profile updated successfully.",
      updatedUser,
      success: true,
    });
  } catch (error) {
    console.log("Failed to update profile.", error);
    return res.status(400).json({
      message: "Failed to update profile.",
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "user",
      },
    });

    // console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User fetched successfully.",
      posts: user.posts,
      success: true,
    });
  } catch (error) {
    console.log("Failed to retrieve posts.", error);
    return res.status(500).json({
      message: "Failed to retrieve posts. Something went wrong.",
      success: false,
    });
  }
};
