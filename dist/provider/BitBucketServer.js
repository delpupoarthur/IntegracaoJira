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
const BaseProvider_1 = require("./BaseProvider");
class BitBucketServer extends BaseProvider_1.BaseProvider {
    constructor() {
        super();
        this.setEmbedColor(0x205081);
        this.embed = new Embed_1.Embed();
    }
    static _formatLargeString(str, limit = 256) {
        return (str.length > limit ? str.substring(0, limit - 1) + '\u2026' : str);
    }
    static _titleCase(str, ifNull = 'None') {
        if (str == null) {
            return ifNull;
        }
        if (str.length < 1) {
            return str;
        }
        const strArray = str.toLowerCase().split(' ');
        for (let i = 0; i < strArray.length; i++) {
            strArray[i] = strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1);
        }
        return strArray.join(' ');
    }
    getName() {
        return 'BitBucketServer';
    }
    getType() {
        return this.headers['x-event-key'];
    }
    diagnosticsPing() {
        return __awaiter(this, void 0, void 0, function* () {
            const field = new EmbedField_1.EmbedField();
            this.embed.title = 'Test Connection';
            this.embed.description = `You have successfully configured Skyhook with your BitBucket Server instance.`;
            field.name = 'Test';
            field.value = this.body.test;
            this.embed.fields = [field];
            this.addEmbed(this.embed);
        });
    }
    repoRefsChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            this.embed.author = this.extractAuthor();
            this.embed.title = `[${this.extractRepoRepositoryName()}] New commit`;
            this.embed.description = this.body.repository.description;
            this.embed.url = this.extractRepoUrl();
            this.embed.fields = this.extractRepoChangesField();
            this.addEmbed(this.embed);
        });
    }
    repoModified() {
        return __awaiter(this, void 0, void 0, function* () {
            this.embed.author = this.extractAuthor();
            this.embed.title = `[${this.body.old.name}] Repository has been updated`;
            this.embed.url = this.extractBaseLink() + '/projects/' + this.body.new.project.key + '/repos/' + this.body.new.slug + '/browse';
            this.addEmbed(this.embed);
        });
    }
    repoForked() {
        return __awaiter(this, void 0, void 0, function* () {
            this.embed.author = this.extractAuthor();
            this.embed.description = 'A new [`fork`] has been created.';
            this.addEmbed(this.embed);
        });
    }
    repoCommentAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommitCommentPayload('New comment no commit');
            this.addEmbed(this.embed);
        });
    }
    repoCommentEdited() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommitCommentPayload('Comment edited on commit');
            this.addEmbed(this.embed);
        });
    }
    repoCommentDeleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommitCommentPayload('Comment deleted on commit');
            this.addEmbed(this.embed);
        });
    }
    prOpened() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request opened');
            this.addEmbed(this.embed);
        });
    }
    prFromRefUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request updated');
            this.addEmbed(this.embed);
        });
    }
    prModified() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request modified');
            this.addEmbed(this.embed);
        });
    }
    prReviewerUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('New reviewers for pull request');
            this.addEmbed(this.embed);
        });
    }
    prReviewerApproved() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request approved');
            this.addEmbed(this.embed);
        });
    }
    prReviewerUnapproved() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload(('Removed approval for pull request'));
            this.addEmbed(this.embed);
        });
    }
    prReviewerNeedsWork() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request needs work');
            this.addEmbed(this.embed);
        });
    }
    pullrequestFulfilled() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request merged');
            this.addEmbed(this.embed);
        });
    }
    prDeclined() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Pull request declined');
            this.addEmbed(this.embed);
        });
    }
    prDeleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatPrPayload('Deleted pull request');
            this.addEmbed(this.embed);
        });
    }
    prCommentAdded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommentPayload('New comment on pull request');
            this.addEmbed(this.embed);
        });
    }
    prCommentEdited() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommentPayload('Updated comment on pull request');
            this.addEmbed(this.embed);
        });
    }
    prCommentDeleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.formatCommentPayload('Deleted comment on pull request');
            this.addEmbed(this.embed);
        });
    }
    mirrorRepoSynchronized() {
        return __awaiter(this, void 0, void 0, function* () {
            this.embed.title = `[${this.extractRepoRepositoryName()}] Mirror Synchronized`;
        });
    }
    formatPrPayload(title) {
        this.embed.author = this.extractAuthor();
        this.embed.title = `[${this.extractPullRequestRepositoryName()}] ${title}: #${this.body.pullRequest.id} ${this.body.pullRequest.title}`;
        this.embed.description = this.body.pullRequest.description;
        this.embed.url = this.extractPullRequestUrl();
        this.embed.fields = this.extractPullRequestFields();
    }
    formatCommentPayload(title) {
        this.embed.author = this.extractAuthor();
        this.embed.title = `[${this.extractPullRequestRepositoryName()}] ${title}: #${this.body.pullRequest.id} ${this.body.pullRequest.title}`;
        this.embed.description = this.body.comment.text;
        this.embed.url = this.extractPullRequestUrl();
    }
    formatCommitCommentPayload(title) {
        this.embed.author = this.extractAuthor();
        this.embed.title = `[${this.extractRepoRepositoryName()}] New comment on commit ${this.body.commit.slice(0, 10)}`;
        this.embed.description = this.body.comment.text;
        this.embed.url = this.extractCommitCommentUrl();
    }
    extractAuthor() {
        const author = new EmbedAuthor_1.EmbedAuthor();
        author.name = this.body.actor.displayName;
        author.iconUrl = 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/44_Bitbucket_logo_logos-512.png';
        return author;
    }
    extractPullRequestUrl() {
        return this.extractBaseLink() + '/projects/' + this.body.pullRequest.fromRef.repository.project.key + '/repos/'
            + this.body.pullRequest.fromRef.repository.slug + '/pull-requests/' + this.body.pullRequest.id + '/overview';
    }
    extractPullRequestFields() {
        const fieldArray = new Array();
        const toFromRefField = new EmbedField_1.EmbedField();
        toFromRefField.name = 'From --> To';
        toFromRefField.value = `**Source branch:** ${this.body.pullRequest.fromRef.displayId} \n **Destination branch:** ${this.body.pullRequest.toRef.displayId} \n **State:** ${this.body.pullRequest.state}`;
        fieldArray.push(toFromRefField);
        for (let i = 0; i < Math.min(this.body.pullRequest.reviewers.length, 18); i++) {
            const reviewerField = new EmbedField_1.EmbedField();
            reviewerField.name = 'Reviewer';
            reviewerField.value = this.body.pullRequest.reviewers[i].user.displayName;
            fieldArray.push(reviewerField);
        }
        return fieldArray;
    }
    extractPullRequestRepositoryName() {
        return this.body.pullRequest.toRef.repository.name;
    }
    extractRepoRepositoryName() {
        return this.body.repository.name;
    }
    extractRepoUrl() {
        return this.extractBaseLink() + '/projects/' + this.body.repository.project.key + '/repos/' + this.body.repository.slug + '/browse';
    }
    extractRepoChangesField() {
        const fieldArray = new Array();
        for (let i = 0; i < Math.min(this.body.changes.length, 18); i++) {
            const changesEmbed = new EmbedField_1.EmbedField();
            changesEmbed.name = 'Change';
            changesEmbed.value = `**Branch:** ${this.body.changes[i].ref.displayId} \n **Old Hash:** ${this.body.changes[i].fromHash.slice(0, 10)} \n **New Hash:** ${this.body.changes[i].toHash.slice(0, 10)} \n **Type:** ${this.body.changes[i].type}`;
            fieldArray.push(changesEmbed);
        }
        return fieldArray;
    }
    extractCommitCommentUrl() {
        return this.extractBaseLink() + '/projects/' + this.body.repository.project.key + '/repos/' + this.body.repository.slug + '/commits/' + this.body.commit;
    }
    extractBaseLink() {
        const actorLink = this.body.actor.links.self[0].href;
        return actorLink.substring(0, actorLink.indexOf('/user'));
    }
}
exports.BitBucketServer = BitBucketServer;
//# sourceMappingURL=BitBucketServer.js.map