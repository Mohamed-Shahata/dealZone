import express from "express";
import { connection_db } from "./DB/connect_db.js";
import { config } from "dotenv";
import { globelResponse } from "./src/middlewares/globelResponse.js";
import buyerAndSellerRoutes from "./src/modules/BuyerAndSeller/BuyerAndSeller.routes.js"
import productRoutes from "./src/modules/Product/product.routes.js"
import postRoutes from "./src/modules/Posts/post.routes.js"
config({ path: "./.env" })

const app = express();

//middleware to parse json data from the request body
app.use(express.json())

//routes
app.use("/users", buyerAndSellerRoutes);
app.use("/products", productRoutes);
app.use("/posts", postRoutes);

//error response handling
app.use(globelResponse)

//database connection
connection_db();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("server is live 🚀"));