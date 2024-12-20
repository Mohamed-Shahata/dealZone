import Buyer from "../../../DB/models/buyer.model.js";
import Product from "../../../DB/models/product.model.js";
import Seller from "../../../DB/models/seller.model.js";

export const createProduct = async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const { role, id } = req.user;

  if (role === "buyer")
    return next(new Error("seller can only create product", { cause: 401 }))

  const product = await Product.create({
    name, description, price, category, seller: id
  })

  let user = await Seller.findById(id)
  user.products.push(product._id);
  await user.save();

  res.status(200).json({ message: "created product seccess", product })
}

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate("seller");
  if (!product) return next(new Error("product not found", { cause: 404 }));

  res.status(200).json({ message: "done", product })
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, category } = req.body;

  let product = await Product.findById(productId);
  if (!product) return next(new Error("product not found", { cause: 404 }));

  product = await Product.findByIdAndUpdate({ _id: productId }, {
    name: name || product.name,
    description: description || product.description,
    price: price || product.price,
    category: category || product.category
  }, { new: true })

  res.status(200).json({ message: "update success", product })
}

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { id } = req.user

  let product = await Product.findById(productId);
  if (!product) return next(new Error("product not found", { cause: 404 }));

  if (product.seller.toString() !== id)
    return next(new Error("can not delete this product", { cause: 401 }))

  await Product.findByIdAndDelete(productId)

  await Seller.findByIdAndUpdate(id, {
    $pull: { products: productId }
  })
  res.status(200).json({ message: "delete success" })
}

export const addAndRemoveFavorite = async (req, res, next) => {
  const { productId } = req.params;
  const { role, id } = req.user;

  if (role === "seller")
    return next(new Error("Only buyers are allowed to add product to favorite", { cause: 401 }))

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found", { cause: 404 }));

  const buyer = await Buyer.findById(id).populate("favorites");

  const isFavorite = buyer.favorites.some((fav) => fav._id.toString() === product._id.toString())
  if (!isFavorite) {
    buyer.favorites.push(product._id);
    await buyer.save();
    return res.status(200).json({ message: "Added product to favorites successfully" })
  }
  buyer.favorites.pull(product._id);
  await buyer.save();
  res.status(200).json({ message: "Removed product from favorites successfully" })
}