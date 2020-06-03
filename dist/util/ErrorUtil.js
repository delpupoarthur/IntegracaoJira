Object.defineProperty(exports, "__esModule", { value: true });
const DiscordPayload_1 = require("../model/DiscordPayload");
const Embed_1 = require("../model/Embed");
/**
 * Error things
 */
class ErrorUtil {
    static createErrorPayload(provider, error) {
        const payload = new DiscordPayload_1.DiscordPayload();
        const embed = new Embed_1.Embed();
        embed.title = `Skyhook Error`;
        embed.url = 'https://github.com/Commit451/skyhook/issues';
        embed.description = `An error has occured on skyhook for your webhook with provider ${provider}. Maybe you can copy/paste or screenshot this error if there is no sensitive information and open an issue on the skyhook GitHub.\n\nError: ${JSON.stringify(error.stack)}`;
        payload.embeds = [];
        payload.embeds.push(embed);
        return payload;
    }
}
exports.ErrorUtil = ErrorUtil;
//# sourceMappingURL=ErrorUtil.js.map