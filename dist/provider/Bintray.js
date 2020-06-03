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
const MarkdownUtil_1 = require("../util/MarkdownUtil");
/**
 * https://bintray.com/docs/api/#_webhooks
 */
class Bintray extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Bintray';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0x43a047);
            const embed = new Embed_1.Embed();
            embed.timestamp = this.body.released;
            embed.title = this.body.package + ' v' + this.body.version + ' Released';
            const fields = [];
            if (this.body.release_notes != null && this.body.release_notes) {
                const field = new EmbedField_1.EmbedField();
                field.inline = false;
                field.name = 'Release Notes';
                field.value = MarkdownUtil_1.MarkdownUtil._formatMarkdown(this.body.release_notes, embed);
                fields.push(field);
            }
            embed.fields = fields;
            this.addEmbed(embed);
        });
    }
}
exports.Bintray = Bintray;
//# sourceMappingURL=Bintray.js.map