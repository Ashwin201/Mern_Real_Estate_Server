import Wishlist from "../modals/wishlist.model.js";
import Post from "../modals/post.model.js";

export const getWishlist = async (req, res) => {
  const userId = req.id;
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "items",
      populate: { path: "post" },
    });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    // console.log(wishlist);
    res
      .status(201)
      .json({ wishlist, message: "Wishlist Found.", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { postId } = req.body;
  const userId = req.id;
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!wishlist.items.includes(postId)) {
      wishlist.items.push({ post: postId });
    }
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { itemId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ user: req.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    const item = wishlist?.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    wishlist.items?.pull(itemId);
    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
