var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const winston_1 = __importDefault(require("winston"));
/**
 * Helps with logging things. Basically a Winston helper
 */
class LoggerUtil {
    static init() {
        if (!this.isInitialized) {
            // @ts-ignore Method exists, will be added to ts def in next release.
            winston_1.default.loggers.add('logger', {
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf((info) => `[${moment_1.default().format('YYYY-MM-DD hh:mm:ss').trim()}] [${info.level}]: ${info.message}`)),
                level: process.env.PRODUCTION ? 'info' : 'debug',
                transports: [
                    new winston_1.default.transports.Console()
                ]
            });
        }
    }
    static logger() {
        // @ts-ignore Method exists, will be added to ts def in next release.
        return winston_1.default.loggers.get('logger');
    }
}
exports.LoggerUtil = LoggerUtil;
LoggerUtil.isInitialized = false;
//# sourceMappingURL=LoggerUtil.js.map