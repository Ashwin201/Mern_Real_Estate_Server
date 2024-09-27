// controllers/postController.js
import Post from "../modals/post.model.js";
import User from "../modals/user.model.js";
export const getPosts = async (req, res) => {
  const { city, property, minPrice, maxPrice } = req.query;
  // console.log(city, property, minPrice, maxPrice);
  try {
    const query = {};
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (property) query.property = property;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

    const posts = await Post.find(query).sort({ createdAt: -1 });
    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "user",
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const data = req.body;
  const allData = { ...data, user: req.id };
  const post = new Post(allData);
  try {
    const newPost = await post.save();
    // Push the new post into the user's posts array
    const user = await User.findById(req.id);
    console.log(user);
    user.posts.push(newPost);
    await user.save();

    // Populate the user field inside the user object
    await newPost.populate("user");

    return res
      .status(201)
      .json({ newPost, message: "Post created successfully", success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.status(201).json({
      updatedPost,
      message: "Post updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
