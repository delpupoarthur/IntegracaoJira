// circleci.js
// https://circleci.com/docs/1.0/configuration/#notify
// ========
module.exports = {
  parse: function (req, discordPayload) {
    var body = req.body
    var id = body.payload.build_num
    var buildUrl = body.build_url
    var outcome = body.payload.
    discordPayload.content = "Build " + id + " " + status + "\n" + buildUrl
  }
};