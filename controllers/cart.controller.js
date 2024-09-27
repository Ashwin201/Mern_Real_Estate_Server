// controllers/cartController.js
import Cart from "../modals/cart.model.js";
import Post from "../modals/post.model.js";

export const getCart = async (req, res) => {
  const userId = req.id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items",
      populate: { path: "post" },
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // console.log(cart);
    res.status(201).json({ cart, message: "Cart Found.", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addToCart = async (req, res) => {
  const { postId } = req.body;
  const userId = req.id;
  // console.log(postId);
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const itemIndex = cart.items.findIndex((item) => item.post.equals(postId));
    if (itemIndex > -1) {
      // cart.items[itemIndex].quantity += 1;
      return res.status(400).json({ message: "Post already added to cart" });
    } else {
      cart.items.push({ post: postId });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ itemId });
    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    const item = cart.items.id(itemId);
    // console.log(item);
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.id;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    // console.log(item);
    cart.items.pull(itemId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetCart = async (req, res) => {
  const userId = req.id;
  try {
    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
