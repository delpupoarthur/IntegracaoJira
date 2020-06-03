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
 * https://www.pingdom.com/resources/webhooks
 */
class Pingdom extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Pingdom';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.body.current_state !== this.body.previous_state) {
                const embed = new Embed_1.Embed();
                embed.title = 'State changed';
                embed.description = 'State change from ' + this.body.previous_state + ' to ' + this.body.current_state;
                this.setEmbedColor((this.body.current_state === 'UP') ? 0x4caf50 : 0xd32f2f);
                this.addEmbed(embed);
            }
        });
    }
}
exports.Pingdom = Pingdom;
//# sourceMappingURL=Pingdom.js.map