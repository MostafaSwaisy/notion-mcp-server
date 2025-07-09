import dotenv from 'dotenv';

dotenv.config();

export const config = {
    notionApiKey: process.env.NOTION_API_KEY || '',
    notionVersion: process.env.NOTION_VERSION || '2022-06-28',
    port: parseInt(process.env.MCP_SERVER_PORT || '3000'),
};

if (!config.notionApiKey) {
    throw new Error('NOTION_API_KEY is required');
}