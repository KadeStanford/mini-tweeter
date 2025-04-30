const router = require("express").Router();
const t = require("../controllers/topicController");

router.all("/:anything*", t.placeholder); // every route returns 501

module.exports = router;
