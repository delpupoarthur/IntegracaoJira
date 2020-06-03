var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Embed_1 = require("../model/Embed");
const BaseProvider_1 = require("../provider/BaseProvider");
/**
 * https://developer.atlassian.com/server/jira/platform/webhooks/
 */
class Jira extends BaseProvider_1.BaseProvider {
    constructor() {
        super();
        this.setEmbedColor(0x1e45a8);
    }
    getName() {
        return 'Jira';
    }
    getPath() {
        return 'jira';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.body.webhookEvent == null) {
                this.payload = null;
                return;
            }
            let isIssue;
            if (this.body.webhookEvent.startsWith('jira:issue_')) {
                isIssue = true;
            }
            else if (this.body.webhookEvent.startsWith('comment_')) {
                isIssue = false;
            }
            else {
                return;
            }
            // extract variable from Jira
            const issue = this.body.issue;
            if (issue.fields.assignee == null) {
                issue.fields.assignee = { displayName: 'nobody' };
            }
            const user = this.body.user;
            const action = this.body.webhookEvent.split('_')[1];
            const matches = issue.self.match(/^(https?:\/\/[^\/?#]+)(?:[\/?#]|$)/i);
            const domain = matches && matches[1];
            // create the embed
            const embed = new Embed_1.Embed();
            embed.title = `${issue.key} - ${issue.fields.summary}`;
            embed.url = `${domain}/browse/${issue.key}`;
            if (isIssue) {
                embed.description = `${user.displayName} ${action} issue: ${embed.title} (${issue.fields.assignee.displayName})`;
            }
            else {
                const comment = this.body.comment;
                embed.description = `${comment.updateAuthor.displayName} ${action} comment: ${comment.body}`;
            }
            this.addEmbed(embed);
        });
    }
}
exports.Jira = Jira;
//# sourceMappingURL=Jira.js.map