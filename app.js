require("dotenv").config();
const express = require("express");
const uploadRoutes = require("./src/routes/uploadRoute");
const statusRoutes = require("./src/routes/statusRoute");

const app = express();

app.use(express.json());
app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);

app.post("/", (req, res) => {
	console.log("body " , req.body);
      res.status(200).send("GET request received and logged");

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
