var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
const DiscordPayload_1 = require("../model/DiscordPayload");
const EmbedFooter_1 = require("../model/EmbedFooter");
const LoggerUtil_1 = require("../util/LoggerUtil");
/**
 * Base provider, which all other providers will subclass. You can then
 * use the provided methods to format the data to Discord
 */
class BaseProvider {
    constructor() {
        this.payload = new DiscordPayload_1.DiscordPayload();
        this.logger = LoggerUtil_1.LoggerUtil.logger();
    }
    static formatType(type) {
        if (type == null) {
            return null;
        }
        type = type.replace(/:/g, '_'); // needed because of BitBucket
        return camelcase_1.default(type);
    }
    /**
     * Override this and provide the name of the provider
     */
    getName() {
        return null;
    }
    /**
     * Right now, the path is always just the same as the name, all lower case. Override if that is not the case
     */
    getPath() {
        return this.getName().toLowerCase();
    }
    parse(body, headers = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            this.body = body;
            this.headers = headers;
            this.query = query;
            let type = 'parseData';
            if (typeof this['getType'] !== 'undefined') {
                type = yield this['getType']();
            }
            type = BaseProvider.formatType(type);
            if (typeof this[type] !== 'undefined') {
                this.logger.info(`Calling ${type}() in ${this.constructor.name} provider.`);
                yield this[type]();
            }
            return this.payload;
        });
    }
    addEmbed(embed) {
        // TODO check to see if too many fields
        // add the footer to all embeds added
        embed.footer = new EmbedFooter_1.EmbedFooter('Powered by Skyhook');
        if (this.embedColor != null) {
            embed.color = this.embedColor;
        }
        if (this.payload.embeds == null) {
            this.payload.embeds = [];
        }
        this.payload.embeds.push(embed);
    }
    setEmbedColor(color) {
        this.embedColor = color;
    }
}
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=BaseProvider.js.map