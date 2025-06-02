---
title: Keboola MCP Integration
permalink: /integrate/mcp/
---

This section describes how to integrate with Keboola using the Model Context Protocol (MCP).
For information on using MCP within the Keboola UI, please see [help.keboola.com/mcp](https://help.keboola.com/mcp).

## Integrate with Existing MCP Clients

Integration to existing MCP clients typically involves configuring the client with your Keboola project details and API tokens/ Oauth provider. Here is list of the popular MCP clients:

*   [Claude](https://claude.ai/)
*   [Cursor](https://cursor.com/)
*   [RooCode](https://roocode.com/)
*   [Windsurf](https://codeium.com/windsurf)

### Claude Messages API with MCP Connector (Beta)

Anthropic offers a beta feature, the [MCP connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector), which enables you to connect to remote MCP servers (such as the Keboola MCP Server) directly through Claude's Messages API. This method bypasses the need for a separate, standalone MCP client if you are already using the Claude Messages API.

**Key features of this integration:**

*   **Direct API Calls**: You configure connections to MCP servers by including the `mcp_servers` parameter in your API requests to Claude.
*   **Tool Calling**: The primary MCP functionality currently supported through this connector is tool usage.
*   **Accessibility**: The target MCP server needs to be publicly accessible over HTTP.

This approach can simplify your architecture if you're building applications that programmatically interact with Claude and need to leverage MCP-enabled tools without managing an additional client layer.

For complete details, API examples, and configuration options, please consult the [official Anthropic MCP connector documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector).

The Keboola MCP Server facilitates this by acting as a bridge, translating natural language queries from your client into actions within your Keboola environment. For a comprehensive list of clients supporting the Model Context Protocol, please visit [list of available clients](https://modelcontextprotocol.io/clients).

## Integrate with Your Own MCP Client

If you are developing your own MCP client or integrating MCP capabilities into a custom application, you can connect to the Keboola MCP Server. The server supports standard MCP communication protocols.

For detailed instructions and SDKs for building your own MCP client, refer to the official [Model Context Protocol documentation for client developers](https://modelcontextprotocol.io/quickstart/client).

Information on supported transports (e.g., stdio, HTTP+SSE) and any specific requirements for custom client integration will be detailed in this section. You can find more information about the Keboola MCP server, including how it can be run and configured, in its [GitHub repository](https://github.com/keboola/mcp-server).

## MCP Server Capabilities

The Keboola MCP Server supports several core concepts of the Model Context Protocol. Here's a summary:

| Concept     | Supported | Notes                                                                                                  |
|-------------|-----------|--------------------------------------------------------------------------------------------------------|
| Transports  | ✅        | Supports `stdio` and `HTTP+SSE` for client communication.                                              |
| Prompts     | ✅        | Processes natural language prompts from MCP clients to interact with Keboola.                          |
| Tools       | ✅        | Provides a rich set of tools for storage operations, component management, SQL execution, job control. |
| Resources   | ❌        | Exposes Keboola project data, configurations, components, transformations, and jobs as resources.      |
| Sampling    | ❌        | Advanced sampling techniques are not explicitly supported by the server itself.                        |
| Roots       | ❌        | The concept of 'Roots' as defined in general MCP is not a specific feature of the Keboola MCP server.  |

## Recommended Way to Execute Keboola MCP Server Locally

For a consistent and isolated environment, running the Keboola MCP Server via [Docker](https://docker.com/get-started/) is often the recommended approach for local execution, especially if you don't want to manage Python environments directly or are integrating with clients that can manage Docker containers. Docker allows applications to be packaged with all their dependencies into a standardized unit for software development.

Before proceeding, ensure you have Docker installed on your system. You can find installation guides on the [official Docker website](https://docs.docker.com/engine/install/).

1.  **Pull the latest image:**
    ```bash
    docker pull keboola/mcp-server:latest
    ```
2.  **Run the Docker container:**

    *   **For Snowflake users:**
        ```bash
        docker run -it --rm \
          -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
          -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
          keboola/mcp-server:latest \
          --api-url https://connection.YOUR_REGION.keboola.com
        ```
        Replace `YOUR_KEBOOLA_STORAGE_TOKEN`, `YOUR_WORKSPACE_SCHEMA`, and `https://connection.YOUR_REGION.keboola.com` with your actual values.

    *   **For BigQuery users (requires volume mount for credentials):**
        ```bash
        # Ensure your Google Cloud credentials JSON file is accessible
        docker run -it --rm \
          -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
          -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
          -e GOOGLE_APPLICATION_CREDENTIALS="/creds/credentials.json" \
          -v /local/path/to/your/credentials.json:/creds/credentials.json \
          keboola/mcp-server:latest \
          --api-url https://connection.YOUR_REGION.keboola.com
        ```
        Replace placeholders and ensure `/local/path/to/your/credentials.json` points to your actual credentials file on your host machine.

    The `--rm` flag ensures the container is removed when it stops. The server inside Docker will typically listen on `stdio` by default, which is suitable for clients that can invoke and manage Docker commands.

    **Example: Configuring Cursor IDE to use Docker for Keboola MCP Server:**

    If your MCP client (like Cursor) supports defining a Docker command for an MCP server, the configuration might look like this:

    ```json
    {
      "mcpServers": {
        "keboola": {
          "command": "docker",
          "args": [
            "run",
            "--it", 
            "--rm", 
            "-e", "KBC_STORAGE_TOKEN", 
            "-e", "KBC_WORKSPACE_SCHEMA", 
            "keboola/mcp-server:latest", 
            "--api-url", "https://connection.YOUR_REGION.keboola.com"
          ],
          "env": {
            "KBC_STORAGE_TOKEN": "YOUR_KEBOOLA_STORAGE_TOKEN",
            "KBC_WORKSPACE_SCHEMA": "YOUR_KEBOOLA_STORAGE_TOKEN"
          }
        }
      }
    }
    ```
    **Note:**
    *   Ensure Docker is running on your system.
    *   Replace placeholders like `YOUR_KEBOOLA_STORAGE_TOKEN`, `YOUR_WORKSPACE_SCHEMA`, and the Keboola API URL.
    *   The client (Cursor) passes the `KBC_STORAGE_TOKEN` and `KBC_WORKSPACE_SCHEMA` from its `env` block to the `docker run` command through the `-e` flags. The `--api-url` is passed directly as an argument to the `keboola/mcp-server` entrypoint.

## Running Keboola MCP Server Locally Using Python

While MCP clients like Cursor or Claude typically manage the MCP server automatically, you might want to run the Keboola MCP Server locally for development, testing, or when using a custom client.

The primary way to run the server locally is by cloning the [Keboola MCP Server GitHub repository](https://github.com/keboola/mcp-server) and running it using Python. Make sure you have Python 3.10+ and `uv` installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/keboola/mcp-server.git
    cd mcp-server
    ```
2.  **Install dependencies (including for development/testing if needed)**:
    ```bash
    uv sync --extra dev 
    ```
3.  **Set up environment variables:**
    Before running the server, you need to configure the following environment variables:
    *   `KBC_STORAGE_TOKEN`: Your Keboola Storage API token.
    *   `KBC_WORKSPACE_SCHEMA`: Your Keboola project's workspace schema (for SQL queries).
    *   `KBC_API_URL`: Your Keboola instance API URL (e.g., `https://connection.keboola.com` or `https://connection.YOUR_REGION.keboola.com`).

    Refer to the [Keboola Tokens](https://help.keboola.com/management/project/tokens/) and [Keboola workspaces manipulation](https://help.keboola.com/tutorial/manipulate/workspace/) for detailed instructions on obtaining these values.

    **3.1. Additional Setup for BigQuery Users**

    If your Keboola project uses BigQuery as its backend, you will also need to set up the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. This variable should point to the JSON file containing your Google Cloud service account key that has the necessary permissions to access your BigQuery data.

    Example:
    `GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`

4.  **Run the server (example using Python module directly for testing CLI manually)**:
    ```bash
    uv run python -m src.keboola_mcp_server.cli --api-url $KBC_API_URL
    ```
    The `KBC_API_URL` was set as environment variable but could be inserted manually using your actual Keboola API URL.
    The server will typically start and listen for connections on host `localhost:8000`. For normal use with supported clients like Claude or Cursor, you usually don't need to run this command manually as they handle the server lifecycle.

### Connecting a Client to a Localhost Instance

When you run the Keboola MCP Server manually, it will typically listen on `stdio` or a specific HTTP port if configured for `HTTP+SSE`.

*   **For `stdio` based clients**: The client application needs to be configured to launch the local MCP server executable (the Python script in this case) and communicate with it over standard input/output.
*   **For `HTTP+SSE` based clients**: If you configure the MCP server to run in HTTP mode (not the default for local Python execution without further arguments), your client would connect to the specified host and port (e.g., `http://localhost:PORT`).

### Cursor IDE Connection

Cursor is designed to work seamlessly with the Keboola MCP Server. In most cases, Cursor will automatically manage the server lifecycle (downloading and running it) when you configure Keboola as an MCP data source within Cursor's settings.

1.  **Open Cursor settings.**
2.  **Navigate to the MCP section within settings.**
3.  **Add or configure your Keboola project.** You will likely need to provide your `KBC_STORAGE_TOKEN`, `KBC_WORKSPACE_SCHEMA` along with defining API URL.

    Here is an example of how you might configure Cursor to use the Keboola MCP Server. This configuration would typically be in a JSON settings file within Cursor (e.g., `mcp_servers.json` or a similar configuration file provided by Cursor):

    ```json
    {
      "mcpServers": {
        "keboola": {
          "command": "uvx",
          "args": [
            "keboola_mcp_server",
            "--api-url", "https://connection.YOUR_REGION.keboola.com"
          ],
          "env": {
            "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
            "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
          }
        }
      }
    }
    ```
    **Note:**
    *   The exact command (`uvx`) and arguments might vary based on how `keboola_mcp_server` is installed and made available in your environment if you are pointing to a globally installed version. If using a local development version, the `command` and `args` would point to your local Python script and its execution, as described in the "Running Keboola MCP Server Locally" section.

Always refer to the latest Cursor documentation for the most up-to-date instructions on configuring external MCP servers. 