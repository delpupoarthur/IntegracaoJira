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
const EmbedField_1 = require("../model/EmbedField");
const BaseProvider_1 = require("../provider/BaseProvider");
/**
 * https://support.codacy.com/hc/en-us/articles/207280359-WebHook-Notifications
 */
class Codacy extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Codacy';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0x242c33);
            const embed = new Embed_1.Embed();
            embed.title = 'New Commit';
            embed.url = this.body.commit.data.urls.delta;
            const fields = [];
            // Results undefined with PR.
            if (this.body.commit.results != null) {
                const fixedIssueField = new EmbedField_1.EmbedField();
                fixedIssueField.name = 'Fixed Issues';
                fixedIssueField.value = this.body.commit.results.fixed_count || 0;
                fixedIssueField.inline = true;
                fields.push(fixedIssueField);
                const newIssuesField = new EmbedField_1.EmbedField();
                newIssuesField.name = 'New Issues';
                newIssuesField.value = this.body.commit.results.new_count || 0;
                newIssuesField.inline = true;
                fields.push(newIssuesField);
            }
            this.addEmbed(embed);
        });
    }
}
exports.Codacy = Codacy;
//# sourceMappingURL=Codacy.js.map