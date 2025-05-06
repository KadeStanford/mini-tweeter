require("dotenv").config();
require("./config/db"); // DB singleton

const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();

/* ---------- view engine ---------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------- middleware ----------- */
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "super-secret-session-string",
    resave: false,
    saveUninitialized: false,
  })
);

/* ---------- core routes ---------- */
app.get(
  "/dashboard",
  require("./controllers/dashboardController").getDashboard
);
app.get("/", (_req, res) => res.redirect("/signup"));

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/genre"));
app.use("/", require("./routes/topic"));
app.use("/", require("./routes/message"));

/* ---------- SSE notifications ---- ★ */
app.use("/notifications", require("./routes/notifications"));

/* ---------- observers ------------ */
require("./observers/notifySubscribers");
require("./observers/topicStats");

/* ---------- server --------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`  Listening on ${PORT}`));
