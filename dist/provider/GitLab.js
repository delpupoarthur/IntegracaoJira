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
const EmbedAuthor_1 = require("../model/EmbedAuthor");
const EmbedField_1 = require("../model/EmbedField");
const BaseProvider_1 = require("../provider/BaseProvider");
class Project {
}
/**
 * https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/project/integrations/webhooks.md
 */
class GitLab extends BaseProvider_1.BaseProvider {
    constructor() {
        super();
        this.setEmbedColor(0xFCA326);
        this.embed = new Embed_1.Embed();
    }
    static _formatAvatarURL(url) {
        if (!/^https?:\/\/|^\/\//i.test(url)) {
            return 'https://gitlab.com' + url;
        }
        return url;
    }
    getName() {
        return 'GitLab';
    }
    getType() {
        return this.body.object_kind;
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const branch = this.body.ref.split('/');
            branch.shift();
            branch.shift();
            const project = this.projectFromBody();
            if (project.totalCommitsCount > 0) {
                const fields = [];
                for (const commit of project.commits) {
                    const message = (commit.message.length > 256) ? commit.message.substring(0, 255) + '\u2026' : commit.message;
                    const field = new EmbedField_1.EmbedField();
                    field.name = 'Commit from ' + commit.author.name;
                    field.value = '(' + '[`' + commit.id.substring(0, 7) + '`](' + commit.url + ')' + ') ' + (message == null ? '' : message.replace(/\n/g, ' ').replace(/\r/g, ' '));
                    field.inline = false;
                    fields.push(field);
                }
                this.embed.title = '[' + project.name + ':' + project.branch + '] ' + project.totalCommitsCount + ' commit' + ((project.totalCommitsCount > 1) ? 's' : '');
                this.embed.url = project.url + '/tree/' + project.branch;
                this.embed.fields = fields;
            }
            else {
                if (this.body.after !== '0000000000000000000000000000000000000000') {
                    this.embed.title = '[' + project.name + ':' + project.branch + '] New branch created: ' + project.branch;
                    this.embed.url = project.url + '/tree/' + project.branch;
                }
                else {
                    this.embed.title = '[' + project.name + ':' + project.branch + '] Branch deleted: ' + project.branch;
                    this.embed.url = project.url;
                }
            }
            this.embed.author = this.authorFromBodyPush();
            this.addEmbed(this.embed);
        });
    }
    tagPush() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpTag = this.body.ref.split('/');
            tmpTag.shift();
            tmpTag.shift();
            const tag = tmpTag.join('/');
            const project = this.projectFromBody();
            this.embed.url = project.url + '/tags/' + tag;
            this.embed.author = this.authorFromBodyPush();
            this.embed.description = (this.body.message != null) ? ((this.body.message.length > 1024) ? this.body.message.substring(0, 1023) + '\u2026' : this.body.message) : '';
            if (this.body.after !== '0000000000000000000000000000000000000000') {
                this.embed.title = `Pushed tag "${tag}" to ${project.name}`;
            }
            else {
                this.embed.title = `Deleted tag "${tag}" to ${project.name}`;
            }
            this.addEmbed(this.embed);
        });
    }
    issue() {
        return __awaiter(this, void 0, void 0, function* () {
            const actions = {
                open: 'Opened',
                close: 'Closed',
                reopen: 'Reopened',
                update: 'Updated'
            };
            this.embed.title = actions[this.body.object_attributes.action] + ' issue #' + this.body.object_attributes.iid + ' on ' + this.body.project.name;
            this.embed.url = this.body.object_attributes.url;
            this.embed.author = this.authorFromBody();
            const field = new EmbedField_1.EmbedField();
            field.name = this.body.object_attributes.title;
            field.value = (this.body.object_attributes.description != null && this.body.object_attributes.description.length > 1024) ? this.body.object_attributes.description.substring(0, 1023) + '\u2026' : this.body.object_attributes.description;
            this.embed.fields = [field];
            this.addEmbed(this.embed);
        });
    }
    note() {
        return __awaiter(this, void 0, void 0, function* () {
            let type = null;
            switch (this.body.object_attributes.noteable_type) {
                case 'Commit':
                    type = 'commit (' + this.body.commit.id.substring(0, 7) + ')';
                    break;
                case 'MergeRequest':
                    type = 'merge request #' + this.body.merge_request.iid;
                    break;
                case 'Issue':
                    type = 'issue #' + this.body.issue.iid;
                    break;
                case 'Snippet':
                    type = 'snippet #' + this.body.snippet.id;
                    break;
            }
            this.embed.title = 'Wrote a comment on ' + type + ' on ' + this.body.project.name;
            this.embed.url = this.body.object_attributes.url;
            this.embed.author = this.authorFromBody();
            this.embed.description = (this.body.object_attributes.note.length > 2048) ? this.body.object_attributes.note.substring(0, 2047) + '\u2026' : this.body.object_attributes.note;
            this.addEmbed(this.embed);
        });
    }
    mergeRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const actions = {
                open: 'Opened',
                close: 'Closed',
                reopen: 'Reopened',
                update: 'Updated',
                merge: 'Merged',
                approved: 'Approved',
                unapproved: 'Unapproved'
            };
            const field = new EmbedField_1.EmbedField();
            field.name = this.body.object_attributes.title;
            field.value = (this.body.object_attributes.description.length > 1024) ? this.body.object_attributes.description.substring(0, 1023) + '\u2026' : this.body.object_attributes.description;
            this.embed.title = actions[this.body.object_attributes.action] + ' merge request #' + this.body.object_attributes.iid + ' on ' + this.body.project.name;
            this.embed.url = this.body.object_attributes.url;
            this.embed.author = this.authorFromBody();
            this.embed.fields = [field];
            this.addEmbed(this.embed);
        });
    }
    wikiPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const actions = {
                create: 'Created',
                delete: 'Deleted',
                update: 'Updated'
            };
            this.embed.title = actions[this.body.object_attributes.action] + ' wiki page ' + this.body.object_attributes.title + ' on ' + this.body.project.name;
            this.embed.url = this.body.object_attributes.url;
            this.embed.author = this.authorFromBody();
            this.embed.description = (this.body.object_attributes.message != null) ? (this.body.object_attributes.message.length > 2048) ? this.body.object_attributes.message.substring(0, 2047) + '\u2026' : this.body.object_attributes.message : '';
            this.addEmbed(this.embed);
        });
    }
    pipeline() {
        return __awaiter(this, void 0, void 0, function* () {
            this.embed.title = 'Pipeline #' + this.body.object_attributes.id + ' on ' + this.body.project.name;
            this.embed.url = this.body.project.web_url + '/pipelines/' + this.body.object_attributes.id;
            this.embed.author = this.authorFromBody();
            this.embed.description = '**Status**: ' + this.body.object_attributes.status;
            this.addEmbed(this.embed);
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            // The build event uses the deprecated repository field.
            const realProj = this.body.project || this.body.repository;
            this.embed.title = 'Build #' + this.body.build_id + ' on ' + realProj.name;
            this.embed.url = realProj.homepage + '/builds/' + this.body.build_id;
            this.embed.author = this.authorFromBody();
            this.embed.description = '**Status**: ' + this.body.build_status;
            this.addEmbed(this.embed);
        });
    }
    authorFromBody() {
        const author = new EmbedAuthor_1.EmbedAuthor();
        author.name = this.body.user.name;
        author.iconUrl = GitLab._formatAvatarURL(this.body.user.avatar_url);
        return author;
    }
    authorFromBodyPush() {
        const author = new EmbedAuthor_1.EmbedAuthor();
        author.name = this.body.user_name;
        author.iconUrl = GitLab._formatAvatarURL(this.body.user_avatar);
        return author;
    }
    projectFromBody() {
        const branch = this.body.ref.split('/');
        branch.shift();
        branch.shift();
        const project = new Project();
        if (this.body.project != null) {
            project.name = this.body.project.name;
            project.url = this.body.project.web_url;
            project.branch = branch.join('/');
            project.commits = this.body.commits || [];
            project.totalCommitsCount = this.body.total_commits_count || 0;
        }
        else if (this.body.repository != null) {
            project.name = this.body.repository.name;
            project.url = this.body.repository.homepage;
            project.branch = branch.join('/');
            project.commits = this.body.commits || [];
            project.totalCommitsCount = this.body.total_commits_count || 0;
        }
        return project;
    }
}
exports.GitLab = GitLab;
//# sourceMappingURL=GitLab.js.map