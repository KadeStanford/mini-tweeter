const express = require("express");
const router = express.Router();
const hub = require("../notificationHub");

/*  GET /notifications/events  – SSE stream for logged-in users  */
router.get("/events", (req, res) => {
  if (!req.session || !req.session.userId) return res.sendStatus(401);

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("retry: 3000\n\n"); // let client know to retry in 3 s

  /* register this connection for the current user */
  hub.addClient(req.session.userId.toString(), res);

  /* ping every 25 s to keep the connection warm */
  const ping = setInterval(() => res.write(":\n\n"), 25_000);
  res.on("close", () => clearInterval(ping));
});

module.exports = router;
