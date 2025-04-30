const router = require("express").Router();
const a = require("../controllers/authController");

router.get("/signup", a.getSignup);
router.get("/login", a.getLogin);
router.get("/logout", a.logout);

router.post("/signup", a.postSignup);
router.post("/login", a.postLogin);

module.exports = router;
