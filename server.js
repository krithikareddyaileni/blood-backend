const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Blood Donor API running 🚀");
});

// routes
app.use("/api/donor", require("./routes/donorRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});