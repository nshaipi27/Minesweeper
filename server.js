const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const { connectToDatabase } = require("./database");
const db = connectToDatabase();
const GameDefinitionModel = require("./models/gameDefinitionModel");

const app = express();
const PORT = 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "requests.log"),
  { flags: "a" }
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(morgan("tiny", { stream: accessLogStream }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const startRoutes = require("./routes/");
const game123RunRoutes = require("./routes/123run");
const leaderboardRoutes = require("./routes/leaderboard");
const catsweeperRoutes = require("./routes/catsweeper");
const playersRoutes = require("./routes/players");

app.use("/", startRoutes);
app.use("/123run", game123RunRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/catsweeper", catsweeperRoutes);
app.use("/players", playersRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
module.exports = app;
