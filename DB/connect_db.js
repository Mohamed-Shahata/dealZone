import mongoose from "mongoose";

export const connection_db = async () => {
  return await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("connected mongodb ✔️"))
    .catch((err) => console.log("mongodb err ✖️: ", err))
};