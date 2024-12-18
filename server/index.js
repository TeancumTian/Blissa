const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Client connected successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
