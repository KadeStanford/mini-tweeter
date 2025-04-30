/**
 * Message Controller – NOT IMPLEMENTED YET
 * ------------------------------------------------
 * Expected usage:
 *   • POST /messages/:topicId  -> create new Message
 *   • Ensure author is subscribed to topic
 *   • Emit "message:new" event on EventBus (Observer pattern)
 */

exports.placeholder = (req, res) =>
  res.status(501).send("Message endpoints not implemented yet.");
