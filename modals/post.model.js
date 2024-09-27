import mongoose from "mongoose";

const TypeEnum = ["rent", "buy"];
const PropertyEnum = ["land", "house", "apartment"];
const PetsEnum = ["allowed", "not-allowed"];

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    images: [{ type: String }],
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    type: { type: String, enum: TypeEnum, required: true },
    property: { type: String, enum: PropertyEnum, required: true },
    pet: { type: String, enum: PetsEnum, required: false },
    income: { type: String, required: false },
    size: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
