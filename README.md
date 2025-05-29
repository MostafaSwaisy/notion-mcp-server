Notion MCP Server
A Model Context Protocol (MCP) server for seamless integration with Notion workspaces. This server provides RESTful API endpoints to create, read, update, delete, and search pages in your Notion workspace.

🚀 Features
Create Pages: Create new pages with title and content
Read Pages: Retrieve page content by ID
Update Pages: Modify existing page titles and content
Delete Pages: Archive pages (soft delete)
Search Pages: Search pages by title
List Pages: Get all pages with pagination support
Health Check: Monitor server status
📋 Prerequisites
Node.js (v14 or higher)
npm or yarn
A Notion account with integration access
🛠️ Installation
Clone or create the project directory:
bash
mkdir notion-mcp-server
cd notion-mcp-server
Install dependencies:
bash
npm install
Set up environment variables:
bash
cp .env.example .env
Edit .env and add your Notion integration token:
env
NOTION_TOKEN=your_notion_integration_token_here
PORT=3000
NOTION_DATABASE_ID=your_database_id_here  # Optional
🔑 Notion Integration Setup
Create a Notion Integration:
Go to https://www.notion.so/my-integrations
Click "New integration"
Give it a name (e.g., "MCP Server")
Select the workspace you want to integrate with
Click "Submit"
Copy the Integration Token:
Copy the "Internal Integration Token"
Add it to your .env file as NOTION_TOKEN
Share Pages/Databases with Your Integration:
Open the Notion page or database you want to access
Click "Share" in the top right
Click "Add people, emails, groups, or integrations"
Search for your integration name and select it
Choose appropriate permissions (usually "Can edit")
Click "Share"
🚀 Running the Server
Development mode with auto-restart:

bash
npm run dev
Production mode:

bash
npm start
The server will start on http://localhost:3000 (or the port specified in your .env file).

📖 API Documentation
Once the server is running, visit http://localhost:3000 to see the complete API documentation with examples and parameter details.

Quick API Reference
Method	Endpoint	Description
POST	/api/pages	Create a new page
GET	/api/pages/:pageId	Get a specific page
PUT	/api/pages/:pageId	Update a page
DELETE	/api/pages/:pageId	Archive a page
GET	/api/pages	List all pages
GET	/api/search	Search pages by title
GET	/health	Health check
💡 Usage Examples
Create a Page
bash
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Page",
    "content": "This is the content of my page.\n\nThis is a second paragraph."
  }'
Search Pages
bash
curl "http://localhost:3000/api/search?query=meeting&limit=5"
Get a Page
bash
curl http://localhost:3000/api/pages/YOUR_PAGE_ID
🔍 Troubleshooting
Common Issues
403 Forbidden Error:
Make sure you've shared your Notion pages/databases with your integration
Verify your integration has the correct permissions
401 Unauthorized Error:
Check that your NOTION_TOKEN in .env is correct
Ensure the token hasn't expired
404 Not Found:
Verify the page ID is correct
Make sure the page exists and is accessible to your integration
Rate Limiting:
Notion API has rate limits; space out your requests if you're making many calls
📝 Project Structure
notion-mcp-server/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── .env              # Your environment variables (create this)
├── public/           # Static files
│   └── index.html    # API documentation page
└── README.md         # This file
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request
📜 License
This project is licensed under the MIT License.

🆘 Support
If you encounter any issues:

Check the troubleshooting section above
Verify your Notion integration setup
Check the server logs for detailed error messages
Ensure all dependencies are properly installed
For additional help, please refer to the Notion API documentation.

