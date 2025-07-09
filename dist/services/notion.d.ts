export declare class NotionService {
    private notion;
    constructor(apiKey: string);
    getPageRawData(pageId: string): Promise<{
        page: import("@notionhq/client/build/src/api-endpoints.js").GetPageResponse;
        blocks: (import("@notionhq/client/build/src/api-endpoints.js").PartialBlockObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").BlockObjectResponse)[];
    }>;
    getPage(pageId: string): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    createPage(title: string, content?: string, parentId?: string): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    updatePage(pageId: string, title?: string, content?: string): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    search(query: string, filter?: any, sort?: any): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    appendBlocks(pageId: string, blocks: any[]): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    getUsers(): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    archivePage(pageId: string): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    getRecentPages(): Promise<(import("@notionhq/client/build/src/api-endpoints.js").PageObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").PartialPageObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").PartialDatabaseObjectResponse | import("@notionhq/client/build/src/api-endpoints.js").DatabaseObjectResponse)[]>;
    private parseContentToBlocks;
    private getDefaultParentId;
}
//# sourceMappingURL=notion.d.ts.map