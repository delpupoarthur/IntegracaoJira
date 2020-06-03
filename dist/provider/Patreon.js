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
const EmbedField_1 = require("../model/EmbedField");
const BaseProvider_1 = require("../provider/BaseProvider");
var PatreonAction;
(function (PatreonAction) {
    PatreonAction[PatreonAction["CREATE"] = 0] = "CREATE";
    PatreonAction[PatreonAction["UPDATE"] = 1] = "UPDATE";
    PatreonAction[PatreonAction["DELETE"] = 2] = "DELETE";
})(PatreonAction || (PatreonAction = {}));
/**
 * https://docs.patreon.com/#webhooks
 */
class Patreon extends BaseProvider_1.BaseProvider {
    constructor() {
        super();
        this.setEmbedColor(0xF96854);
    }
    static _formatHTML(html, baseLink) {
        const newLineRegex = /<br>/g;
        // Match lists
        while (this.ulRegex.test(html)) {
            const match = this.ulRegex.exec(html);
            html = html.replace(this.ulRegex, match[1]);
            let str = match[1];
            while (this.liRegex.test(str)) {
                const match2 = this.liRegex.exec(match[1]);
                str = str.replace(match2[0], '');
                html = html.replace(this.liRegex, '\uFEFF\u00A0\u00A0\u00A0\u00A0\u2022 ' + match2[1] + '\n');
            }
        }
        // Match bold
        while (this.boldRegex.test(html)) {
            const match = this.boldRegex.exec(html);
            html = html.replace(this.boldRegex, '**' + match[1] + '**');
        }
        // Match Italic
        while (this.italicRegex.test(html)) {
            const match = this.italicRegex.exec(html);
            html = html.replace(this.italicRegex, '_' + match[1] + '_');
        }
        // Replace Underlined
        while (this.underlineRegex.test(html)) {
            const match = this.underlineRegex.exec(html);
            html = html.replace(this.underlineRegex, '__' + match[1] + '__');
        }
        // Replace Anchors
        while (this.anchorRegex.test(html)) {
            const match = this.anchorRegex.exec(html);
            const url = match[1].startsWith('#') ? baseLink + match[1] : match[1];
            html = html.replace(this.anchorRegex, '[' + match[2] + '](' + url + ')');
        }
        // Replace Images
        while (this.imageRegex.test(html)) {
            const match = this.imageRegex.exec(html);
            html = html.replace(this.imageRegex, '[View Image..](' + match[1] + ')');
        }
        // Replace all br tags
        html = html.replace(newLineRegex, '\n');
        return html;
    }
    getName() {
        return 'Patreon';
    }
    getType() {
        return this.headers['x-patreon-event'];
    }
    _handleAPIV2(type) {
        var _a, _b, _c, _d;
        const embed = new Embed_1.Embed();
        const campaignId = (_b = (_a = this.body.data.relationships.campaign) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id;
        const patronId = (_d = (_c = this.body.data.relationships.user) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id;
        // TODO Test endpoint may be returning incomplete data.
        // Does not provide a way to get the reward without keying off of amount_cents.
        // Keep an eye on data.relationships.currently_entitled_tiers
        // For now, find closest tier that is below or at the cents value.
        const reward = this.body.included
            .filter(val => val.type === 'reward' && val.attributes.published && val.attributes.amount_cents <= this.body.data.attributes.pledge_amount_cents)
            .reduce((a, b) => Math.max(a.attributes.amount_cents, b.attributes.amount_cents));
        for (const entry of this.body.included) {
            if (entry.type === 'campaign' && entry.id === campaignId) {
                const dollarAmount = (this.body.data.attributes.pledge_amount_cents / 100).toFixed(2);
                if (type === PatreonAction.DELETE) {
                    embed.title = `Canceled $${dollarAmount} Pledge`;
                }
                else {
                    embed.title = `Pledged $${dollarAmount}`;
                }
                embed.url = entry.attributes.url;
            }
            else if (entry.type === 'user' && entry.id === patronId) {
                const author = new EmbedAuthor_1.EmbedAuthor();
                author.name = entry.attributes.full_name;
                author.iconUrl = entry.attributes.thumb_url;
                author.url = entry.attributes.url;
                embed.author = author;
            }
        }
        if (reward != null && type !== PatreonAction.DELETE) {
            const field = new EmbedField_1.EmbedField();
            field.name = 'Unlocked Tier';
            field.value = `[${reward.attributes.title} ($${(reward.attributes.amount_cents / 100).toFixed(2)}+/mo)](https://www.patreon.com${reward.attributes.url})\n${Patreon._formatHTML(reward.attributes.description, embed.url)}`;
            field.inline = false;
            embed.fields = [field];
        }
        this.addEmbed(embed);
    }
    membersCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.CREATE);
        });
    }
    membersUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.UPDATE);
        });
    }
    membersDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.DELETE);
        });
    }
    membersPledgeCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.CREATE);
        });
    }
    membersPledgeUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.UPDATE);
        });
    }
    membersPledgeDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            this._handleAPIV2(PatreonAction.DELETE);
        });
    }
    /**
     * @deprecated Patreon v1 API
     */
    _createUpdateCommon(type) {
        var _a, _b, _c, _d, _e, _f;
        const embed = new Embed_1.Embed();
        const createorId = (_b = (_a = this.body.data.relationships.campaign) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id;
        const patreonId = (_d = (_c = this.body.data.relationships.patron) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id;
        const rewardId = (_f = (_e = this.body.data.relationships.reward) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.id;
        const incl = this.body.included;
        let reward = null;
        incl.forEach((attr) => {
            if (attr.id === createorId) {
                const dollarAmount = (this.body.data.attributes.amount_cents / 100).toFixed(2);
                if (type === PatreonAction.DELETE) {
                    embed.title = `Canceled $${dollarAmount} Pledge`;
                }
                else {
                    embed.title = `Pledged $${dollarAmount}`;
                }
                embed.url = attr.attributes.url;
            }
            else if (attr.id === patreonId) {
                const author = new EmbedAuthor_1.EmbedAuthor();
                author.name = attr.attributes.full_name;
                author.iconUrl = attr.attributes.thumb_url;
                author.url = attr.attributes.url;
                embed.author = author;
            }
            else if (attr.id === rewardId) {
                reward = attr;
            }
        });
        if (reward != null && type !== PatreonAction.DELETE) {
            const field = new EmbedField_1.EmbedField();
            field.name = 'Unlocked Tier';
            field.value = `[${reward.attributes.title} ($${(reward.attributes.amount_cents / 100).toFixed(2)}+/mo)](https://www.patreon.com${reward.attributes.url})\n${Patreon._formatHTML(reward.attributes.description, embed.url)}`;
            field.inline = false;
            embed.fields = [field];
        }
        this.addEmbed(embed);
    }
    /**
     * @deprecated Patreon v1 API
     */
    pledgesCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._createUpdateCommon(PatreonAction.CREATE);
        });
    }
    /**
     * @deprecated Patreon v1 API
     */
    pledgesUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._createUpdateCommon(PatreonAction.UPDATE);
        });
    }
    /**
     * @deprecated Patreon v1 API
     */
    pledgesDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            this._createUpdateCommon(PatreonAction.DELETE);
        });
    }
}
exports.Patreon = Patreon;
// HTML Regular Expressions
Patreon.boldRegex = /<strong>(.*?)<\/strong>/;
Patreon.italicRegex = /<em>(.*?)<\/em>/;
Patreon.underlineRegex = /<u>(.*?)<\/u>/;
Patreon.anchorRegex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/;
Patreon.ulRegex = /<ul>(.*?)<\/ul>/;
Patreon.liRegex = /<li>(.*?)<\/li>/;
Patreon.imageRegex = /<img.*src="(.*?)">/;
//# sourceMappingURL=Patreon.js.map