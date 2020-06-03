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
const BaseProvider_1 = require("../provider/BaseProvider");
/**
 * https://www.appveyor.com/docs/notifications/#webhook-payload-default
 */
class AppVeyor extends BaseProvider_1.BaseProvider {
    getName() {
        return 'AppVeyor';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0x00B3E0);
            const embed = new Embed_1.Embed();
            embed.title = 'Build ' + this.body.eventData.buildVersion;
            embed.url = this.body.eventData.buildUrl;
            embed.description = this.body.eventData.commitMessage + '\n\n' + '**Status**: ' + this.body.eventData.status;
            const author = new EmbedAuthor_1.EmbedAuthor();
            author.name = this.body.eventData.commitAuthor;
            if (this.body.eventData.repositoryProvider === 'gitHub') {
                author.url = 'https://github.com/' + this.body.eventData.repositoryName + '/commit/' + this.body.eventData.commitId;
            }
            embed.author = author;
            if (this.body.eventData.jobs[0].artifacts.length !== 0) {
                embed.description += '\n**Artifacts**:';
                for (const artifact of this.body.eventData.jobs[0].artifacts) {
                    embed.description += '\n- [' + artifact.fileName + '](' + artifact.permalink + ')';
                }
            }
            this.addEmbed(embed);
        });
    }
}
exports.AppVeyor = AppVeyor;
//# sourceMappingURL=Appveyor.js.map