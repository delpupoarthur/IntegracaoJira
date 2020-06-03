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
const BitBucketServer_1 = require("./provider/BitBucketServer");
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const ErrorUtil_1 = require("./util/ErrorUtil");
const LoggerUtil_1 = require("./util/LoggerUtil");
const Appveyor_1 = require("./provider/Appveyor");
const Bintray_1 = require("./provider/Bintray");
const Bitbucket_1 = require("./provider/Bitbucket");
const CircleCi_1 = require("./provider/CircleCi");
const Codacy_1 = require("./provider/Codacy");
const DockerHub_1 = require("./provider/DockerHub");
const GitLab_1 = require("./provider/GitLab");
const Heroku_1 = require("./provider/Heroku");
const Jenkins_1 = require("./provider/Jenkins");
const Jira_1 = require("./provider/Jira");
const NewRelic_1 = require("./provider/NewRelic");
const Patreon_1 = require("./provider/Patreon");
const Pingdom_1 = require("./provider/Pingdom");
const Travis_1 = require("./provider/Travis");
const Trello_1 = require("./provider/Trello");
const Unity_1 = require("./provider/Unity");
const UptimeRobot_1 = require("./provider/UptimeRobot");
const VSTS_1 = require("./provider/VSTS");
LoggerUtil_1.LoggerUtil.init();
const logger = LoggerUtil_1.LoggerUtil.logger();
logger.debug('Winston setup successfully.');
const app = express_1.default();
/**
 * Array of the classes
 */
const providers = [
    Appveyor_1.AppVeyor,
    Bintray_1.Bintray,
    Bitbucket_1.BitBucket,
    BitBucketServer_1.BitBucketServer,
    CircleCi_1.CircleCi,
    Codacy_1.Codacy,
    DockerHub_1.DockerHub,
    GitLab_1.GitLab,
    Heroku_1.Heroku,
    Jenkins_1.Jenkins,
    Jira_1.Jira,
    NewRelic_1.NewRelic,
    Patreon_1.Patreon,
    Pingdom_1.Pingdom,
    Travis_1.Travis,
    Trello_1.Trello,
    Unity_1.Unity,
    UptimeRobot_1.UptimeRobot,
    VSTS_1.VSTS
];
const providersMap = new Map();
const providerNames = [];
const providerInstances = [];
const providerInfos = [];
providers.forEach((Provider) => {
    const instance = new Provider();
    providerInstances.push(instance);
    providersMap.set(instance.getPath(), Provider);
    console.log(`Adding provider name ${instance.getName()}`);
    providerNames.push(instance.getName());
    const providerInfo = {
        name: instance.getName(),
        path: instance.getPath()
    };
    providerInfos.push(providerInfo);
});
providerNames.sort();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { providers: providerInfos });
});
app.get('/providers', (req, res) => {
    res.status(200).send(providerNames);
});
app.get('/api/webhooks/:webhookID/:webhookSecret/:from', (req, res) => {
    // Return 200 if the provider is valid to show this url is ready.
    const provider = req.params.from;
    if (provider == null || providersMap.get(provider) == null) {
        const errorMessage = `Unknown provider ${provider}`;
        logger.error(errorMessage);
        res.status(400).send(errorMessage);
    }
    else {
        res.sendStatus(200);
    }
});
app.post('/api/webhooks/:webhookID/:webhookSecret/:from', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const webhookID = req.params.webhookID;
    const webhookSecret = req.params.webhookSecret;
    const providerName = req.params.from;
    if (!webhookID || !webhookSecret || !providerName) {
        res.sendStatus(400);
        return;
    }
    const discordEndpoint = `https://discordapp.com/api/webhooks/${webhookID}/${webhookSecret}`;
    let discordPayload = null;
    const Provider = providersMap.get(providerName);
    if (Provider != null) {
        const instance = new Provider();
        try {
            const queryString = JSON.stringify(req.query);
            const queryObject = JSON.parse(queryString);
            console.log(queryObject);
            // seems dumb, but this is the best way I know how to format these headers in a way we can use them
            const headersString = JSON.stringify(req.headers);
            const headersObject = JSON.parse(headersString);
            discordPayload = yield instance.parse(req.body, headersObject, queryObject);
        }
        catch (error) {
            res.sendStatus(500);
            logger.error('Error during parse: ' + error.stack);
            discordPayload = ErrorUtil_1.ErrorUtil.createErrorPayload(providerName, error);
        }
    }
    else {
        const errorMessage = `Unknown provider ${providerName}`;
        logger.error(errorMessage);
        res.status(400).send(errorMessage);
    }
    if (discordPayload != null) {
        const jsonString = JSON.stringify(discordPayload);
        axios_1.default({
            data: jsonString,
            method: 'post',
            url: discordEndpoint,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            logger.error(err);
            res.status(502).send(err);
        });
    }
}));
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
const port = normalizePort(process.env.PORT || '8080');
const server = app.listen(port, () => {
    logger.debug(`Your app is listening on port ${port}`);
});
function normalizePort(givenPort) {
    const normalizedPort = parseInt(givenPort, 10);
    if (isNaN(normalizedPort)) {
        // named pipe
        return givenPort;
    }
    if (normalizedPort >= 0) {
        // port number
        return normalizedPort;
    }
    return false;
}
module.exports = server;
//# sourceMappingURL=index.js.map