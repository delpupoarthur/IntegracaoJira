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
 * https://build-api.cloud.unity3d.com/docs/1.0.0/index.html#operation-webhooks-intro
 */
class Unity extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Unity Cloud';
    }
    getPath() {
        return 'unity';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0x222C37);
            const projectName = this.body.projectName;
            const projectVersion = this.body.buildNumber;
            let share = null;
            try {
                share = this.body.links.artifacts[0].files.href;
            }
            catch (err) {
                // Artifact not present
            }
            const type = this.body.buildStatus;
            let content = 'No download available.';
            let download = '';
            this.payload.username = projectName + ' Buildserver';
            switch (type) {
                case 'success':
                    if (share) {
                        download = share.href;
                        content = '[`Download it here`](' + download + ')';
                    }
                    content = '**New build**\n' + content;
                    break;
                case 'queued':
                    content = '**In build queue**\nIt will be update to version  #' + projectVersion + '\n';
                    break;
                case 'started':
                    content = '**Build is started**\nBuilding version  #' + projectVersion + '\n';
                    break;
                case 'failed':
                    content = '**Build failed**\n' + 'Latest version is still  #' + (projectVersion - 1) + '\n';
                    break;
            }
            const embed = new Embed_1.Embed();
            embed.title = '[' + projectName + '] ' + ' version #' + projectVersion;
            embed.url = download;
            embed.description = content;
            this.addEmbed(embed);
        });
    }
}
exports.Unity = Unity;
//# sourceMappingURL=Unity.js.map