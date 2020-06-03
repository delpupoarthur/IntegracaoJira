Object.defineProperty(exports, "__esModule", { value: true });
/**
 * https://discordapp.com/developers/docs/resources/channel#embed-object-embed-footer-structure
 */
class EmbedFooter {
    constructor(text) {
        this.text = text;
    }
    get iconUrl() {
        return this.icon_url;
    }
    set iconUrl(value) {
        this.icon_url = value;
    }
    get proxyIconUrl() {
        return this.proxy_icon_url;
    }
    set proxyIconUrl(value) {
        this.proxy_icon_url = value;
    }
}
exports.EmbedFooter = EmbedFooter;
//# sourceMappingURL=EmbedFooter.js.map