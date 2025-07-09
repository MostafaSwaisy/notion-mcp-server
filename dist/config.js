"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    notionApiKey: process.env.NOTION_API_KEY || '',
    notionVersion: process.env.NOTION_VERSION || '2022-06-28',
    port: parseInt(process.env.MCP_SERVER_PORT || '3000'),
};
if (!exports.config.notionApiKey) {
    throw new Error('NOTION_API_KEY is required');
}
//# sourceMappingURL=config.js.map