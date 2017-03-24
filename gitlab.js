// gitlab.js
// https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/project/integrations/webhooks.md
// ========
module.exports = {
  parse: function (req, discordPayload) {
    var body = req.body
    var username = body.user_name
    var type = body.object_kind
    var ref = body.ref
    switch (type) {
        
      case "push":
        var url = body.project.web_url
        var projectName = body.project.name
        var numberOfCommits = body.total_commits_count
        discordPayload.content = username + " pushed " + numberOfCommits + " commit(s) to " + projectName + "\n" + url;
        break;
        
      case "tag_push":
        var url = body.project.web_url
        var projectName = body.project.name
        //get the name of the tag
        var split = ref.split("/");
        var tag = split[2]
        discordPayload.content = username + " pushed tag " + ref + " to " + projectName + "\n" + url + "/tags/" + tag;
        break;
        
      case "issue":
        var projectName = body.project.name
        var action = body.object_attributes.state
        var user = body.user.username
        var issueUrl = body.object_attributes.url
        discordPayload.content = user + " " + action + " issue on " + projectName + "\n" + issueUrl;
        break;
        
      case "note":
        var projectName = body.project.name
        var action = body.object_attributes.state
        var user = body.user.username
        var noteUrl = body.object_attributes.url
        var noteType = body.object_attributes.noteable_type
        var note = body.object_attributes.note
        discordPayload.content = user + " commented on " + noteType + " on " + projectName + "\n" + "\"" + note+ "\"" + "\n" + noteUrl;
        break;
        
      case "merge_request":
        var action = body.object_attributes.state
        var user = body.user.username
        var issueUrl = body.object_attributes.url
        discordPayload.content = user + " " + action + " merge request\n" + issueUrl;
        break;
    }
    
  }
};