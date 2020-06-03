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
/**
 * https://docs.microsoft.com/en-us/vsts/service-hooks/create-subscription
 */
class VSTS extends BaseProvider_1.BaseProvider {
    constructor() {
        super();
        this.setEmbedColor(0x68217a);
        this.embed = new Embed_1.Embed();
    }
    getName() {
        return 'VSTS';
    }
    getType() {
        return this.body.eventType;
    }
    // PUSH
    gitPush() {
        return __awaiter(this, void 0, void 0, function* () {
            const author = new EmbedAuthor_1.EmbedAuthor();
            author.name = this.body.resource.pushedBy.displayName;
            author.iconUrl = this.body.resource.pushedBy.imageUrl;
            const fields = [];
            this.body.resource.commits.forEach((commit) => {
                const field = new EmbedField_1.EmbedField();
                field.name = 'Commit from ' + this.body.resource.pushedBy.displayName;
                field.value = '([`' + commit.commitId.substring(0, 7) + '`](' + this.body.resource.repository.remoteUrl + '/commit/' + commit.commitId + ')) ' + commit.comment;
                field.inline = false;
                fields.push(field);
            });
            this.embed.fields = fields;
            this.embed.author = author;
            this.addMinimalMessage();
        });
    }
    // CHECK IN
    tfvcCheckin() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.body.resource.checkedInBy.displayName;
            const field = new EmbedField_1.EmbedField();
            field.name = 'Check in from ' + name;
            field.value = '([`' + this.body.resource.changesetId + '`](' + this.body.resource.url + ')) ' + this.body.resource.comment;
            field.inline = false;
            this.embed.fields = [field];
            this.addMinimalMessage();
        });
    }
    // PULL REQUEST
    gitPullrequestCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            const author = this.extractCreatedByAuthor();
            this.embed.author = author;
            const field = new EmbedField_1.EmbedField();
            field.name = 'Pull Request from ' + this.body.resource.createdBy.displayName;
            field.value = '([`' + this.body.resource.title + '`](' + this.body.resource.repository.remoteUrl + ')) ' + this.body.resource.description;
            field.inline = false;
            this.embed.fields = [field];
            this.addMinimalMessage();
        });
    }
    // PULL REQUEST MERGE COMMIT
    gitPullrequestMerged() {
        return __awaiter(this, void 0, void 0, function* () {
            const author = this.extractCreatedByAuthor();
            this.embed.author = author;
            const field = new EmbedField_1.EmbedField();
            field.name = 'Pull Request Merge Commit from ' + this.body.resource.createdBy.displayName;
            field.value = '([`' + this.body.resource.title + '`](' + this.body.resource.repository.remoteUrl + ')) ' + this.body.resource.description;
            field.inline = false;
            this.embed.fields = [field];
            this.addMinimalMessage();
        });
    }
    // PULL REQUEST UPDATED
    gitPullrequestUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            const author = this.extractCreatedByAuthor();
            this.embed.author = author;
            const field = new EmbedField_1.EmbedField();
            field.name = 'Pull Request Updated by ' + this.body.resource.createdBy.displayName;
            field.value = '([`' + this.body.resource.title + '`](' + this.body.resource.repository.remoteUrl + ')) ' + this.body.resource.description;
            field.inline = false;
            this.embed.fields = [field];
            this.addMinimalMessage();
        });
    }
    // WORK ITEM COMMENTED ON
    workitemCommented() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // WORK ITEM CREATED
    workitemCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // WORK ITEM DELETED
    workitemDeleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // WORK ITEM RESTORED
    workitemRestored() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // WORK ITEM UPDATED
    workitemUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // BUILD COMPLETED
    buildComplete() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE CREATED
    msVssReleaseReleaseCreatedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE ABANDONED
    msVssReleaseReleaseAbandonedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE DEPLOYMENT APPROVAL COMPLETED
    msVssReleaseDeploymentApprovalCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE DEPLOYMENT APPROVAL PENDING
    msVssReleaseDeploymentApprovalPendingEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE DEPLOYMENT COMPLETED
    msVssReleaseDeploymentCompletedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // RELEASE DEPLOYMENT STARTED
    msVssReleaseDeplyomentStartedEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addMinimalMessage();
        });
    }
    // Because carpal tunnel...
    addMinimalMessage() {
        this.embed.title = this.body.message.markdown;
        this.addEmbed(this.embed);
    }
    extractCreatedByAuthor() {
        const author = new EmbedAuthor_1.EmbedAuthor();
        author.name = this.body.resource.createdBy.displayName;
        author.iconUrl = this.body.resource.createdBy.imageUrl;
        return author;
    }
}
exports.VSTS = VSTS;
//# sourceMappingURL=VSTS.js.map