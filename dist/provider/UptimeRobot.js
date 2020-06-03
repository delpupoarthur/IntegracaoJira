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
 * https://blog.uptimerobot.com/web-hook-alert-contacts-new-feature/
 * Example:
 * http://www.domain.com/?monitorID=95987545252&monitorURL=http://test.com&monitorFriendlyName=TestWebsite&alertType=*0&alertDetails=ConnectionTimeout&monitorAlertContacts=457;2;john@doe.com
 */
class UptimeRobot extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Uptime Robot';
    }
    getPath() {
        return 'uptimerobot';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new Embed_1.Embed();
            embed.title = this.query.monitorFriendlyName;
            embed.url = this.query.monitorURL;
            embed.description = this.query.alertDetails;
            this.addEmbed(embed);
        });
    }
}
exports.UptimeRobot = UptimeRobot;
//# sourceMappingURL=UptimeRobot.js.map