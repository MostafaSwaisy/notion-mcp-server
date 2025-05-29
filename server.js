const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Utility function to create page content blocks
function createContentBlocks(content) {
    return content.split('\n\n').map(paragraph => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
            rich_text: [{
                type: 'text',
                text: {
                    content: paragraph
                }
            }]
        }
    }));
}

// MCP Endpoints

// 1. Create a new page
app.post('/api/pages', async (req, res) => {
    try {
        const { title, content, parentId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const pageData = {
            parent: parentId ? 
                { page_id: parentId } : 
                { database_id: process.env.NOTION_DATABASE_ID },
            properties: {
                title: {
                    title: [{
                        text: {
                            content: title
                        }
                    }]
                }
            }
        };

        // Create the page
        const response = await notion.pages.create(pageData);

        // Add content if provided
        if (content) {
            const blocks = createContentBlocks(content);
            await notion.blocks.children.append({
                block_id: response.id,
                children: blocks
            });
        }

        res.json({
            success: true,
            page: {
                id: response.id,
                title: title,
                url: response.url,
                created_time: response.created_time
            }
        });

    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ 
            error: 'Failed to create page',
            details: error.message 
        });
    }
});

// 2. Read a page by ID
app.get('/api/pages/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;

        // Get page properties
        const page = await notion.pages.retrieve({ page_id: pageId });
        
        // Get page content (blocks)
        const blocks = await notion.blocks.children.list({
            block_id: pageId,
        });

        // Extract title from properties
        let title = 'Untitled';
        if (page.properties.title && page.properties.title.title.length > 0) {
            title = page.properties.title.title[0].text.content;
        } else if (page.properties.Name && page.properties.Name.title.length > 0) {
            title = page.properties.Name.title[0].text.content;
        }

        // Extract content from blocks
        let content = '';
        blocks.results.forEach(block => {
            if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
                content += block.paragraph.rich_text.map(text => text.text.content).join('') + '\n\n';
            }
        });

        res.json({
            success: true,
            page: {
                id: page.id,
                title: title,
                content: content.trim(),
                url: page.url,
                created_time: page.created_time,
                last_edited_time: page.last_edited_time
            }
        });

    } catch (error) {
        console.error('Error reading page:', error);
        res.status(500).json({ 
            error: 'Failed to read page',
            details: error.message 
        });
    }
});

// 3. Search pages by title
app.get('/api/search', async (req, res) => {
    try {
        const { query, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const searchResponse = await notion.search({
            query: query,
            filter: {
                property: 'object',
                value: 'page'
            },
            page_size: parseInt(limit)
        });

        const pages = searchResponse.results.map(page => {
            let title = 'Untitled';
            
            // Extract title from different possible property structures
            if (page.properties.title && page.properties.title.title.length > 0) {
                title = page.properties.title.title[0].text.content;
            } else if (page.properties.Name && page.properties.Name.title.length > 0) {
                title = page.properties.Name.title[0].text.content;
            }

            return {
                id: page.id,
                title: title,
                url: page.url,
                created_time: page.created_time,
                last_edited_time: page.last_edited_time
            };
        });

        res.json({
            success: true,
            query: query,
            total_results: pages.length,
            pages: pages
        });

    } catch (error) {
        console.error('Error searching pages:', error);
        res.status(500).json({ 
            error: 'Failed to search pages',
            details: error.message 
        });
    }
});

// 4. Update a page
app.put('/api/pages/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const { title, content } = req.body;

        // Update title if provided
        if (title) {
            await notion.pages.update({
                page_id: pageId,
                properties: {
                    title: {
                        title: [{
                            text: {
                                content: title
                            }
                        }]
                    }
                }
            });
        }

        // Update content if provided
        if (content) {
            // First, get all existing blocks
            const existingBlocks = await notion.blocks.children.list({
                block_id: pageId,
            });

            // Delete existing blocks
            for (const block of existingBlocks.results) {
                await notion.blocks.delete({
                    block_id: block.id
                });
            }

            // Add new content
            const blocks = createContentBlocks(content);
            await notion.blocks.children.append({
                block_id: pageId,
                children: blocks
            });
        }

        res.json({
            success: true,
            message: 'Page updated successfully',
            page_id: pageId
        });

    } catch (error) {
        console.error('Error updating page:', error);
        res.status(500).json({ 
            error: 'Failed to update page',
            details: error.message 
        });
    }
});

// 5. Delete a page
app.delete('/api/pages/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;

        await notion.pages.update({
            page_id: pageId,
            archived: true
        });

        res.json({
            success: true,
            message: 'Page archived successfully',
            page_id: pageId
        });

    } catch (error) {
        console.error('Error archiving page:', error);
        res.status(500).json({ 
            error: 'Failed to archive page',
            details: error.message 
        });
    }
});

// 6. List all pages (with pagination)
app.get('/api/pages', async (req, res) => {
    try {
        const { start_cursor, page_size = 10 } = req.query;

        const searchParams = {
            filter: {
                property: 'object',
                value: 'page'
            },
            page_size: parseInt(page_size)
        };

        if (start_cursor) {
            searchParams.start_cursor = start_cursor;
        }

        const response = await notion.search(searchParams);

        const pages = response.results.map(page => {
            let title = 'Untitled';
            
            if (page.properties.title && page.properties.title.title.length > 0) {
                title = page.properties.title.title[0].text.content;
            } else if (page.properties.Name && page.properties.Name.title.length > 0) {
                title = page.properties.Name.title[0].text.content;
            }

            return {
                id: page.id,
                title: title,
                url: page.url,
                created_time: page.created_time,
                last_edited_time: page.last_edited_time
            };
        });

        res.json({
            success: true,
            pages: pages,
            has_more: response.has_more,
            next_cursor: response.next_cursor
        });

    } catch (error) {
        console.error('Error listing pages:', error);
        res.status(500).json({ 
            error: 'Failed to list pages',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Notion MCP Server',
        timestamp: new Date().toISOString()
    });
});

// Serve documentation page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Notion MCP Server running on port ${PORT}`);
    console.log(`Documentation available at: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;