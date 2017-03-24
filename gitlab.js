// gitlab.js
// ========
module.exports = {
  parse: function (req, discordPayload) {
    // whatever
    var body = req.body
    discordPayload.content = body.before;
  }
};