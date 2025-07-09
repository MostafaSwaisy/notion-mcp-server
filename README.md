# Notion MCP Server

A Model Context Protocol (MCP) server for Notion integration, providing AI assistants with secure access to Notion workspaces.

## Features

- **Page Management**: Create, read, update, and archive Notion pages
- **Search**: Search across your Notion workspace
- **Block Operations**: Append blocks and manage page content
- **User Management**: Access workspace users and permissions
- **Resource Providers**: Expose Notion content as MCP resources

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Notion API**:
   - Go to [Notion Developers](https://developers.notion.com/)
   - Create a new integration
   - Copy the integration token

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Notion API key
   ```

4. **Share pages with integration**:
   - Go to your Notion pages
   - Share → Add people → Find your integration → Invite

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing with MCP Inspector
```bash
npx @modelcontextprotocol/inspector
```

## Tools Available

- `notion_get_page`: Retrieve a page by ID
- `notion_create_page`: Create a new page
- `notion_update_page`: Update an existing page
- `notion_search`: Search workspace content
- `notion_append_blocks`: Add blocks to a page
- `notion_get_users`: Get workspace users
- `notion_archive_page`: Archive a page

## Resources

- `notion://pages`: Recent pages in workspace
- `notion://page/{id}`: Specific page content

## Integration with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["path/to/notion-mcp-server/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "your_token_here"
      }
    }
  }
}
```