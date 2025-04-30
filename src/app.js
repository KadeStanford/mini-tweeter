require("./config/db"); // DB singleton

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "super-secret-session-string",
    resave: false,
    saveUninitialized: false,
  })
);

// routes
app.use("/", require("./routes/auth"));
//app.use("/", require("./routes/topic")); // stubs
//app.use("/", require("./routes/message")); // stubs

// protected placeholder
app.get("/dashboard", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("dashboard");
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Listening on ${PORT}`));
