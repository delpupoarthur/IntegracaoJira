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
 * https://docs.newrelic.com/docs/alerts/new-relic-alerts/managing-notification-channels/customize-your-webhook-payload
 */
class NewRelic extends BaseProvider_1.BaseProvider {
    getName() {
        return 'New Relic';
    }
    getPath() {
        return 'newrelic';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = this.body.details;
            const state = this.body.current_state;
            const embed = new Embed_1.Embed();
            embed.title = `${this.body.condition_name} ${state}`;
            embed.url = this.body.incident_url;
            embed.description = details;
            this.addEmbed(embed);
        });
    }
}
exports.NewRelic = NewRelic;
//# sourceMappingURL=NewRelic.js.map