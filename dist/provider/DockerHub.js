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
 * https://docs.docker.com/docker-hub/webhooks/
 */
class DockerHub extends BaseProvider_1.BaseProvider {
    getName() {
        return 'DockerHub';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0xFFFFFF);
            const embed = new Embed_1.Embed();
            embed.title = this.body.repository.repo_name;
            embed.description = 'New push for tag: ' + this.body.push_data.tag;
            embed.url = this.body.repository.repo_url;
            this.addEmbed(embed);
        });
    }
}
exports.DockerHub = DockerHub;
//# sourceMappingURL=DockerHub.js.map