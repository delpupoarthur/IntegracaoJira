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
const gravatar = require('gravatar');
/**
 * https://devcenter.heroku.com/articles/app-webhooks
 */
class Heroku extends BaseProvider_1.BaseProvider {
    getName() {
        return 'Heroku';
    }
    parseData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setEmbedColor(0xC9C3E6);
            const embed = new Embed_1.Embed();
            const action = this.actionAsPastTense(this.body.action);
            const type = this.typeAsReadable(this.body.webhook_metadata.event.include);
            const authorName = this.body.actor.email;
            const name = this.body.data.name;
            embed.title = `${authorName} ${action} ${type}. App: ${name}`;
            embed.url = this.body.data.web_url;
            const author = new EmbedAuthor_1.EmbedAuthor();
            author.name = authorName;
            const imageUrl = gravatar.url(this.body.actor.email, { s: '100', r: 'x', d: 'retro' }, true);
            author.iconUrl = imageUrl;
            embed.author = author;
            this.addEmbed(embed);
        });
    }
    actionAsPastTense(action) {
        switch (action) {
            case 'create':
                return 'created';
            case 'destroy':
                return 'destroyed';
            case 'update':
                return 'updated';
        }
        return 'unknown';
    }
    typeAsReadable(type) {
        return type.split('api:')[1];
    }
}
exports.Heroku = Heroku;
//# sourceMappingURL=Heroku.js.map