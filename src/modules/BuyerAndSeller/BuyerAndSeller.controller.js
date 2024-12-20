import bcryptjs from "bcryptjs";
import Buyer from "../../../DB/models/buyer.model.js";
import { genrateAccessToken } from "../../utils/genrateToken.js";
import Seller from "../../../DB/models/seller.model.js";
import Product from "../../../DB/models/product.model.js";

const getUserModel = (role) => role === "buyer" ? Buyer : Seller;

export const createBuyer = async (req, res, next) => {
  const { name, age, bio, email, password, role } = req.body;

  if (!["buyer", "seller"].includes(role))
    return next(new Error("Invalid role", { cause: 400 }))

  const existingBuyer = await Buyer.findOne({ email })
  const existingSeller = await Seller.findOne({ email })
  if (existingBuyer || existingSeller)
    return next(new Error("User already exists", { cause: 400 }))

  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(password, salt);

  const Model = getUserModel(role);
  const userData = { name, bio, email, password: hashedPassword };

  if (role === "buyer" && age) userData.age = age;

  const user = await Model.create(userData);

  const accessToken = genrateAccessToken(user);
  res.status(201).json({ message: `Created ${role} successfully`, user, accessToken })
};

export const getProfile = async (req, res, next) => {
  const { userId } = req.params;

  const user =
    (await Buyer.findById(userId).populate("following").populate("favorites")) ||
    (await Seller.findById(userId).populate("followers").populate("products").populate("posts"))

  if (!user) return next(new Error("User not found", { cause: 404 }));

  const accessToken = genrateAccessToken(user);
  res.status(200).json({ message: `profile of ${user.role}`, data: user, accessToken })
}

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { id, role } = req.user;
  const { name, age, bio, email, password } = req.body;


  if (userId !== id) {
    return next(new Error("Unauthorized to edit this user", { cause: 401 }))
  }

  const Model = getUserModel(role);
  const user = await Model.findById(id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  user.name = name || user.name;
  user.email = email || user.email;
  user.bio = bio || user.bio;

  if (password) {
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);
  }
  if (role === "buyer" && age) user.age = age;

  await user.save();

  res.status(200).json({ message: `Updated ${role} successfully`, data: user })
}

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const { id, role } = req.user;

  if (userId !== id) {
    return next(new Error("Unauthorized to edit this user", { cause: 401 }))
  }

  const Model = getUserModel(role);
  const user = await Model.findByIdAndDelete(id);

  if (!user) return next(new Error("User not found", { cause: 404 }));

  res.status(200).json({ message: `Deleted ${role} successfully` })
}

export const followUnfollow = async (req, res, next) => {
  const { userId } = req.params;
  const { id } = req.user;

  const buyer = await Buyer.findById(id);
  const seller = await Seller.findById(userId);

  if (!seller) return next(new Error("Seller not found", { cause: 404 }));
  if (seller._id.toString() === id) return next(new Error("Cannot follow yourself", { cause: 400 }));

  const isFollowing = buyer.following.includes(userId);
  if (!isFollowing) {
    seller.followers.push(id);
    buyer.following.push(userId);
    await Promise.all([seller.save(), buyer.save()]);
    return res.status(200).json({ message: "Followed seller successfully" })
  }
  seller.followers.pull(id);
  buyer.following.pull(userId);
  await Promise.all([seller.save(), buyer.save()]);
  res.status(200).json({ message: "Unfollowed seller successfully" })
}