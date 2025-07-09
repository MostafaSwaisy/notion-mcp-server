import { Client } from '@notionhq/client';
import { config } from '../config.js';

export class NotionService {
    private notion: Client;

    constructor(apiKey: string) {
        this.notion = new Client({
            auth: apiKey,
            notionVersion: config.notionVersion,
        });
    }

    // Raw data method for resources
    async getPageRawData(pageId: string) {
        try {
            const page = await this.notion.pages.retrieve({ page_id: pageId });
            const blocks = await this.notion.blocks.children.list({
                block_id: pageId,
            });

            return {
                page,
                blocks: blocks.results,
            };
        } catch (error) {
            throw new Error(`Failed to get page data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Formatted method for tools
    async getPage(pageId: string) {
        try {
            const pageData = await this.getPageRawData(pageId);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(pageData, null, 2),
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to get page: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async createPage(title: string, content?: string, parentId?: string) {
        try {
            const pageData: any = {
                parent: parentId
                    ? { page_id: parentId }
                    : { page_id: await this.getDefaultParentId() },
                properties: {
                    title: {
                        title: [
                            {
                                text: {
                                    content: title,
                                },
                            },
                        ],
                    },
                },
            };

            if (content) {
                pageData.children = this.parseContentToBlocks(content);
            }

            const page = await this.notion.pages.create(pageData);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Page created successfully: ${page.id}`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to create page: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async updatePage(pageId: string, title?: string, content?: string) {
        try {
            if (title) {
                await this.notion.pages.update({
                    page_id: pageId,
                    properties: {
                        title: {
                            title: [
                                {
                                    text: {
                                        content: title,
                                    },
                                },
                            ],
                        },
                    },
                });
            }

            if (content) {
                const blocks = this.parseContentToBlocks(content);
                await this.notion.blocks.children.append({
                    block_id: pageId,
                    children: blocks,
                });
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `Page updated successfully: ${pageId}`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to update page: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async search(query: string, filter?: any, sort?: any) {
        try {
            const searchParams: any = { query };

            if (filter) {
                searchParams.filter = filter;
            }

            if (sort) {
                searchParams.sort = sort;
            }

            const results = await this.notion.search(searchParams);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async appendBlocks(pageId: string, blocks: any[]) {
        try {
            const result = await this.notion.blocks.children.append({
                block_id: pageId,
                children: blocks,
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Blocks appended successfully: ${result.results.length} blocks added`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to append blocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getUsers() {
        try {
            const users = await this.notion.users.list({});

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(users, null, 2),
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async archivePage(pageId: string) {
        try {
            await this.notion.pages.update({
                page_id: pageId,
                archived: true,
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Page archived successfully: ${pageId}`,
                    },
                ],
            };
        } catch (error) {
            throw new Error(`Failed to archive page: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getRecentPages() {
        try {
            const results = await this.notion.search({
                filter: {
                    value: 'page',      
                    property: 'object',   
                },
                sort: {
                    direction: 'descending',
                    timestamp: 'last_edited_time',
                },
                page_size: 10,
            });

            return results.results;
        } catch (error) {
            throw new Error(`Failed to get recent pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private parseContentToBlocks(content: string): any[] {
        const lines = content.split('\n');
        const blocks: any[] = [];

        for (const line of lines) {
            if (line.trim() === '') continue;

            if (line.startsWith('# ')) {
                blocks.push({
                    object: 'block',
                    type: 'heading_1',
                    heading_1: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: line.substring(2),
                                },
                            },
                        ],
                    },
                });
            } else if (line.startsWith('## ')) {
                blocks.push({
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: line.substring(3),
                                },
                            },
                        ],
                    },
                });
            } else if (line.startsWith('### ')) {
                blocks.push({
                    object: 'block',
                    type: 'heading_3',
                    heading_3: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: line.substring(4),
                                },
                            },
                        ],
                    },
                });
            } else if (line.startsWith('- ')) {
                blocks.push({
                    object: 'block',
                    type: 'bulleted_list_item',
                    bulleted_list_item: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: line.substring(2),
                                },
                            },
                        ],
                    },
                });
            } else {
                blocks.push({
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content: line,
                                },
                            },
                        ],
                    },
                });
            }
        }

        return blocks;
    }

    private async getDefaultParentId(): Promise<string> {
        try {
            const results = await this.notion.search({
                filter: {
                    value: 'page',      
                    property: 'object',   
                },
                page_size: 1,
            });

            if (results.results.length > 0) {
                return results.results[0].id;
            }

            throw new Error('No pages found to use as parent');
        } catch (error) {
            throw new Error(`Failed to get default parent: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}