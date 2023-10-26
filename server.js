const express = require("express");
const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const app = express();

// This will be the path on the SD Card the Express Server will use to serve the website
const wwwPath = "/storage/sd/www/";

// Sends a UDP message to the player 'front end' to let it know the zip extraction is complete
async function sendUDPMessage(message) {
  try {
    let data = new FormData();
    let config = { headers: { "Content-Type": "multipart/form-data" } };
    data.append("key", message);
    const response = await axios.post("http://localhost:8008/SendUDP", data, config);
  } catch (error) {
    console.error("Error sending POST request:", error);
  }
}

app.use(express.static(wwwPath));

// Call this route from an HTML widget, or from a browswer to start the zip extraction
app.get("/preload", (req, res) => {
  // Hardcoded to look for this specific zip file that was uploaded via the BA:con Presentation
  const archivePath = "/storage/pool1/Archive.zip";

  // Check if the "www" folder exists and delete it if it does. Crude, but effective.
  if (fs.existsSync(wwwPath)) {
    fs.rmSync(wwwPath, { recursive: true });
  }

  // Create a new "www" folder
  fs.mkdirSync(wwwPath);

  // Extract the contents of "Archive.zip" into the "www" folder, send the response, and send the UDP message to the player 'front end'
  // This coudl use better error handling, but it works for now.
  fs.createReadStream(archivePath)
    .pipe(unzipper.Extract({ path: wwwPath }))
    .on("finish", () => {
      console.log('Zip file extracted and "www" folder recreated.');
      res.send('Zip file extracted and "www" folder recreated.');
      sendUDPMessage("loadSite");
    })
    .on("error", (err) => {
      console.error("Error extracting zip file:", err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
