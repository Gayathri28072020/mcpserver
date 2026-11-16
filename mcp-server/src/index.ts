
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = "http://localhost:5000/api/tasks";

const server = new McpServer({
    name: "task-management-server",
    version: "1.0.0"
});

// API helper
async function callAPI(
    path: string,
    method: string = "GET",
    body?: object
) {
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    return data;
}

// TOOL 1: GET ALL TASKS
server.registerTool(
    "get_tasks",
    {
        description: "Get all tasks from SQL Server",
        inputSchema: {}
    },
    async () => {
        try {
            const tasks = await callAPI("");

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(tasks, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: String(error)
                }],
                isError: true
            };
        }
    }
);

// TOOL 2: CREATE TASK
server.registerTool(
    "create_task",
    {
        description: "Create a new task in SQL Server",
        inputSchema: {
            title: z.string().min(1).max(200),
            description: z.string().optional()
        }
    },
    async ({ title, description }) => {
        try {
            const task = await callAPI("", "POST", {
                Title: title,
                Description: description ?? ""
            });

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(task, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: String(error)
                }],
                isError: true
            };
        }
    }
);


server.registerTool(
    "update_task",
    {
        description: "Update a new task in SQL Server",
        inputSchema: {
            id: z.number(),
            title: z.string().min(1).max(200),
            description: z.string().optional(),
            isCompleted: z.boolean()
        }
    },
    async ({ id, title, description,isCompleted }) => {
        try {
            const task = await callAPI(`/${id}`, "PUT", {
                Title: title,
                Description: description ?? "",
                IsCompleted: isCompleted

            });

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(task, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: String(error)
                }],
                isError: true
            };
        }
    }
);

// START MCP SERVER
const transport = new StdioServerTransport();

await server.connect(transport);

console.error("Task Management MCP Server started!");
