// gitlab.js
// https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/project/integrations/webhooks.md
// ========
module.exports = {
  parse: function (req, discordPayload) {
    var body = req.body
    var username = body.user_name
    var url = body.project.web_url
    var type = body.object_kind
    var projectName = body.project.name
    var numberOfCommits = body.total_commits_count
    switch (type) {
      case "push":
        discordPayload.content = username + " pushed " + numberOfCommits + " commit(s) to " + projectName + "\n" + url;
        break;
    }
    
  }
};