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
 * https://circleci.com/docs/1.0/configuration/#notify
 */
class CircleCi extends BaseProvider_1.BaseProvider {
    getName() {
        return 'CircleCi';
    }
    parseData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = this.body.payload.subject.length > 48 ? `${this.body.payload.subject.substring(0, 48)}\u2026` : this.body.payload.subject;
            this.setEmbedColor(0x343433);
            const embed = new Embed_1.Embed();
            embed.title = `Build #${this.body.payload.build_num}`;
            embed.url = this.body.payload.build_url;
            embed.description = `[\`${this.body.payload.vcs_revision.slice(0, 7)}\`](${this.body.payload.compare}) : ${subject} - ${this.body.payload.committer_name}\n\`Outcome\`: ${this.body.payload.outcome}`;
            this.addEmbed(embed);
        });
    }
}
exports.CircleCi = CircleCi;
//# sourceMappingURL=CircleCi.js.map