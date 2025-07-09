import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NotionService } from './services/notion.js';
import { config } from './config.js';
class NotionMCPServer {
    private server: Server;
    private notionService: NotionService;

    constructor() {
        this.server = new Server(
            {
                name: 'notion-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    resources: {},
                    tools: {},
                },
            }
        );

        this.notionService = new NotionService(config.notionApiKey);
        this.setupHandlers();
    }

    private setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'notion_get_page',
                        description: 'Retrieve a Notion page by ID',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                pageId: {
                                    type: 'string',
                                    description: 'The ID of the Notion page to retrieve',
                                },
                            },
                            required: ['pageId'],
                        },
                    },
                    {
                        name: 'notion_create_page',
                        description: 'Create a new Notion page',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                parentId: {
                                    type: 'string',
                                    description: 'Parent page ID (optional)',
                                },
                                title: {
                                    type: 'string',
                                    description: 'Page title',
                                },
                                content: {
                                    type: 'string',
                                    description: 'Page content in markdown format',
                                },
                            },
                            required: ['title'],
                        },
                    },
                    {
                        name: 'notion_update_page',
                        description: 'Update an existing Notion page',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                pageId: {
                                    type: 'string',
                                    description: 'The ID of the page to update',
                                },
                                title: {
                                    type: 'string',
                                    description: 'New page title (optional)',
                                },
                                content: {
                                    type: 'string',
                                    description: 'New content to append (optional)',
                                },
                            },
                            required: ['pageId'],
                        },
                    },
                    {
                        name: 'notion_search',
                        description: 'Search Notion workspace',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'Search query',
                                },
                                filter: {
                                    type: 'object',
                                    description: 'Search filter (optional)',
                                    properties: {
                                        object: {
                                            type: 'string',
                                            enum: ['page', 'database'],
                                        },
                                    },
                                },
                                sort: {
                                    type: 'object',
                                    description: 'Sort options (optional)',
                                    properties: {
                                        direction: {
                                            type: 'string',
                                            enum: ['ascending', 'descending'],
                                        },
                                        timestamp: {
                                            type: 'string',
                                            enum: ['last_edited_time', 'created_time'],
                                        },
                                    },
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'notion_append_blocks',
                        description: 'Append blocks to a page',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                pageId: {
                                    type: 'string',
                                    description: 'Page ID to append blocks to',
                                },
                                blocks: {
                                    type: 'array',
                                    description: 'Array of block objects',
                                    items: {
                                        type: 'object',
                                    },
                                },
                            },
                            required: ['pageId', 'blocks'],
                        },
                    },
                    {
                        name: 'notion_get_users',
                        description: 'Get workspace users',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                        },
                    },
                    {
                        name: 'notion_archive_page',
                        description: 'Archive a Notion page',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                pageId: {
                                    type: 'string',
                                    description: 'The ID of the page to archive',
                                },
                            },
                            required: ['pageId'],
                        },
                    },
                ],
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                if (!args || typeof args !== 'object') {
                    throw new Error('Invalid or missing arguments');
                }

                const toolArgs = args as Record<string, unknown>;

                switch (name) {
                    case 'notion_get_page':
                        if (typeof toolArgs.pageId !== 'string') {
                            throw new Error('pageId must be a string');
                        }
                        return await this.notionService.getPage(toolArgs.pageId);

                    case 'notion_create_page':
                        if (typeof toolArgs.title !== 'string') {
                            throw new Error('title must be a string');
                        }
                        return await this.notionService.createPage(
                            toolArgs.title,
                            typeof toolArgs.content === 'string' ? toolArgs.content : undefined,
                            typeof toolArgs.parentId === 'string' ? toolArgs.parentId : undefined
                        );

                    case 'notion_update_page':
                        if (typeof toolArgs.pageId !== 'string') {
                            throw new Error('pageId must be a string');
                        }
                        return await this.notionService.updatePage(
                            toolArgs.pageId,
                            typeof toolArgs.title === 'string' ? toolArgs.title : undefined,
                            typeof toolArgs.content === 'string' ? toolArgs.content : undefined
                        );

                    case 'notion_search':
                        if (typeof toolArgs.query !== 'string') {
                            throw new Error('query must be a string');
                        }
                        return await this.notionService.search(
                            toolArgs.query,
                            typeof toolArgs.filter === 'object' && toolArgs.filter !== null ? toolArgs.filter : undefined,
                            typeof toolArgs.sort === 'object' && toolArgs.sort !== null ? toolArgs.sort : undefined
                        );

                    case 'notion_append_blocks':
                        if (typeof toolArgs.pageId !== 'string') {
                            throw new Error('pageId must be a string');
                        }
                        if (!Array.isArray(toolArgs.blocks)) {
                            throw new Error('blocks must be an array');
                        }
                        return await this.notionService.appendBlocks(
                            toolArgs.pageId,
                            toolArgs.blocks
                        );

                    case 'notion_get_users':
                        return await this.notionService.getUsers();

                    case 'notion_archive_page':
                        if (typeof toolArgs.pageId !== 'string') {
                            throw new Error('pageId must be a string');
                        }
                        return await this.notionService.archivePage(toolArgs.pageId);

                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        },
                    ],
                    isError: true,
                };
            }
        });

        // List resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'notion://pages',
                        name: 'Recent Pages',
                        description: 'Recently modified pages in workspace',
                        mimeType: 'application/json',
                    },
                ],
            };
        });

        // Read resources
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const { uri } = request.params;

            try {
                if (uri === 'notion://pages') {
                    const pages = await this.notionService.getRecentPages();
                    return {
                        contents: [
                            {
                                uri,
                                mimeType: 'application/json',
                                text: JSON.stringify(pages, null, 2),
                            },
                        ],
                    };
                }

                if (uri.startsWith('notion://page/')) {
                    const pageId = uri.replace('notion://page/', '');
                    const pageData = await this.notionService.getPageRawData(pageId);
                    return {
                        contents: [
                            {
                                uri,
                                mimeType: 'application/json',
                                text: JSON.stringify(pageData, null, 2),
                            },
                        ],
                    };
                }

                throw new Error(`Unknown resource: ${uri}`);
            } catch (error) {
                throw new Error(`Failed to read resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    // Add this after the existing start() method
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Notion MCP Server started');
        setTimeout(async () => {
            console.error('🔍 Testing Notion connection...');
            try {
                const users = await this.notionService.getUsers();
                console.error('✅ SUCCESS: Notion API works!');
                console.error('Users found:', users.content[0].text.split('\n').length);
            } catch (error) {
                console.error('❌ FAILED:', error instanceof Error ? error.message : String(error));
            }
        }, 2000);
    }
}

// Start the server
const server = new NotionMCPServer();
server.start().catch(console.error);