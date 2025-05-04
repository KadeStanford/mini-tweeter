const User = require("../models/user");
const UserPreference = require("../models/userpreference"); 

exports.getSignup = (_, res) => res.render("signup");
exports.getLogin = (_, res) => res.render("login");

exports.postSignup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    //Create user preferences record with firstlogin flag
    await UserPreference.create({
    userId: newUser._id,
      genres: [],
      firstLogin: true
    )};

    res.redirect("/login");

  } catch (e) {
    res.status(400).send("Signup error: " + e.message);
  }
};

exports.postLogin = async (req, res) => {
  try {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const ok = user && (await user.comparePassword(password));
  if (!ok) return res.status(401).send("Bad credentials");
  req.session.userId = user._id;
// Check if this is the user's first login
const userPrefs = await UserPreference.findOne({ userId: user._id });
    
if (userPrefs && userPrefs.firstLogin) {
  res.redirect("/genre-selection");
} else {
  res.redirect("/dashboard");
}
} catch (error) {
res.status(500).send("Login error: " + error.message);
}
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
