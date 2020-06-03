var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * For running quick test things in node
 */
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const Heroku_1 = require("./provider/Heroku");
const ErrorUtil_1 = require("./util/ErrorUtil");
testPayloadVisual(new Heroku_1.Heroku(), 'heroku.json');
function testPayloadVisual(provider, jsonFileName) {
    const json = fs.readFileSync(`./test/${jsonFileName}`, 'utf-8');
    provider.parse(JSON.parse(json)).then((discordPayload) => {
        sendPayload(discordPayload);
    }).catch((err) => {
        console.log(err);
        const payload = ErrorUtil_1.ErrorUtil.createErrorPayload(provider.getName(), err);
        sendPayload(payload);
    });
}
function sendPayload(discordPayload) {
    const discordEndpoint = process.env.TEST_HOOK;
    if (discordEndpoint == null) {
        console.log('Endpoint is null. You should set it to test out the payload visuals');
        return;
    }
    const jsonString = JSON.stringify(discordPayload);
    axios_1.default({
        data: jsonString,
        method: 'post',
        url: discordEndpoint
    }).then(() => {
        console.log('Sent');
    }).catch((err) => {
        console.log(err);
    });
}
//# sourceMappingURL=test.js.map