const User = require("../models/user");

exports.getSignup = (_, res) => res.render("signup");
exports.getLogin = (_, res) => res.render("login");

exports.postSignup = async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect("/login");
  } catch (e) {
    res.status(400).send("Signup error: " + e.message);
  }
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const ok = user && (await user.comparePassword(password));
  if (!ok) return res.status(401).send("Bad credentials");
  req.session.userId = user._id;
  res.redirect("/dashboard");
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
