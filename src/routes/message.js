const router = require("express").Router();
const m = require("../controllers/messageController");

router.all("/:anything*", t.placeholder);

module.exports = router;
