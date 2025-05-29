# Notion MCP Server

A **Model Context Protocol (MCP)** server to seamlessly integrate with your Notion workspace.
This server offers a RESTful API to **create, read, update, delete,** and **search** pages within your Notion workspace.

---

## 🚀 Features

* **Create Pages**: Add new pages with titles and content
* **Read Pages**: Retrieve page content by ID
* **Update Pages**: Edit existing page titles and content
* **Delete Pages**: Archive pages (soft delete)
* **Search Pages**: Search pages by title
* **List Pages**: Retrieve all pages with pagination
* **Health Check**: Monitor server status

---

## 📋 Prerequisites

* Node.js v14 or higher
* npm or yarn
* A Notion account with integration access

---

## 🛠️ Installation

1. Clone or create the project directory:

   ```bash
   mkdir notion-mcp-server
   cd notion-mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Notion integration token and other details:

   ```
   NOTION_TOKEN=your_notion_integration_token_here
   PORT=3000
   NOTION_DATABASE_ID=your_database_id_here  # Optional
   ```

---

## 🔑 Notion Integration Setup

1. **Create a Notion Integration:**

   * Go to [Notion Integrations](https://www.notion.so/my-integrations)
   * Click **New integration**
   * Name it (e.g., "MCP Server")
   * Select your workspace and submit

2. **Copy the Integration Token:**

   * Copy the **Internal Integration Token**
   * Paste it into your `.env` as `NOTION_TOKEN`

3. **Share Pages/Databases with Your Integration:**

   * Open the Notion page or database you want to access
   * Click **Share** (top right)
   * Select **Add people, emails, groups, or integrations**
   * Find your integration by name and select it
   * Grant at least **Can edit** permissions
   * Click **Share**

---

## 🚀 Running the Server

* **Development mode (auto-restart on changes):**

  ```bash
  npm run dev
  ```

* **Production mode:**

  ```bash
  npm start
  ```

The server runs on `http://localhost:3000` (or your configured `PORT`).

---

## 📖 API Documentation

Once the server is running, visit:

```
http://localhost:3000
```

to see complete API docs with usage examples and parameter details.

---

## 🔍 Quick API Reference

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/pages`         | Create a new page                |
| GET    | `/api/pages/:pageId` | Get a specific page              |
| PUT    | `/api/pages/:pageId` | Update a page                    |
| DELETE | `/api/pages/:pageId` | Archive (soft delete) a page     |
| GET    | `/api/pages`         | List all pages (with pagination) |
| GET    | `/api/search`        | Search pages by title            |
| GET    | `/health`            | Server health check              |

---

## 💡 Usage Examples

**Create a Page**

```bash
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -d '{ "title": "My New Page", "content": "This is the content of my page.\n\nThis is a second paragraph." }'
```

**Search Pages**

```bash
curl "http://localhost:3000/api/search?query=meeting&limit=5"
```

**Get a Page**

```bash
curl http://localhost:3000/api/pages/YOUR_PAGE_ID
```

---

## 🔍 Troubleshooting

* **403 Forbidden:**

  * Ensure your Notion pages/databases are shared with your integration
  * Confirm integration permissions include edit access

* **401 Unauthorized:**

  * Verify your `NOTION_TOKEN` is correct and valid

* **404 Not Found:**

  * Confirm the page ID is accurate and accessible

* **Rate Limiting:**

  * Notion API has rate limits—pace your requests accordingly

---

## 📝 Project Structure

```
notion-mcp-server/
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
├── .env                 # Your environment variables (create this)
├── public/              # Static files
│   └── index.html       # API documentation page
└── README.md            # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🆘 Support

If you encounter issues:

* Check the **Troubleshooting** section above
* Verify your Notion integration setup
* Check server logs for error details
* Ensure all dependencies are installed correctly
* Refer to [Notion API Documentation](https://developers.notion.com/docs) for further help

---
written by Mostafa Swaisy 💡 and Puma 🤝 (OpenAI GPT)  
