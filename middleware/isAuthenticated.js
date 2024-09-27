import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.cookies?.authToken;
    // console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "User is not authenticated.",
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Something went wrong in middleware");
    return res.status(400).json({
      message: "Something went wrong in middleware",
      success: false,
    });
  }
};
export default isAuthenticated;
