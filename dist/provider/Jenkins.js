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
 * https://plugins.jenkins.io/notification
 */
class Jenkins extends BaseProvider_1.BaseProvider {
    static capitalize(str) {
        const tmp = str.toLowerCase();
        return tmp.charAt(0).toUpperCase() + tmp.slice(1);
    }
    getName() {
        return 'Jenkins-CI';
    }
    getPath() {
        return 'jenkins';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0xF0D6B7);
            const phase = this.body.build.phase;
            const embed = new Embed_1.Embed();
            embed.title = 'Project ' + this.body.name;
            embed.url = this.body.build.full_url;
            switch (phase) {
                case 'STARTED':
                    embed.description = 'Started build #' + this.body.build.number;
                    break;
                case 'COMPLETED':
                case 'FINALIZED':
                    embed.description = Jenkins.capitalize(phase) + ' build #' + this.body.build.number + ' with status: ' + this.body.build.status;
                    break;
            }
            this.addEmbed(embed);
        });
    }
}
exports.Jenkins = Jenkins;
//# sourceMappingURL=Jenkins.js.map