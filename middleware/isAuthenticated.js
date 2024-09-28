import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const cookieString = req?.headers.cookie;
    const cookies = cookieString.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    const token = cookies.authToken;
    // console.log("Token", token);
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
