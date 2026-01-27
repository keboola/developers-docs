---
title: Keboola MCP Integration
permalink: /integrate/mcp/
---

<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-triangle"></i>
    <strong>SSE Transport Deprecation:</strong> The SSE transport for MCP Server will be deprecated on 01.04.2026. Please migrate to Streamable HTTP transport using <code>/mcp</code> endpoints instead of <code>/sse</code>. Streamable HTTP provides bidirectional streaming for improved performance and reliability.
</div>

> The Keboola MCP Server is available at [github.com/keboola/mcp-server](https://github.com/keboola/mcp-server).
> If this integration works well for you, please consider giving the repository a ⭐️!

This section describes how to integrate with Keboola using the Model Context Protocol (MCP).
For information on using MCP within the Keboola UI, please see [help.keboola.com/ai/mcp-server/](https://help.keboola.com/ai/mcp-server/).

## Integrate with Existing MCP Clients

Integration with existing MCP clients typically involves configuring the client with your Keboola project details and API tokens/OAuth provider. Popular MCP clients include:

*   [Claude](https://claude.ai/)
*   [Cursor](https://cursor.com/)
*   [RooCode](https://roocode.com/)
*   [Windsurf](https://codeium.com/windsurf)

The Keboola MCP Server facilitates this by acting as a bridge, translating natural language queries from your client into actions within your Keboola environment. For a comprehensive list of clients supporting the Model Context Protocol, please visit [list of available clients](https://modelcontextprotocol.io/clients).

### Claude Messages API with MCP Connector (Beta)

Anthropic offers a beta feature, the [MCP connector](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector), which enables you to connect to remote MCP servers (such as the Keboola MCP Server) directly through Claude's Messages API. This method bypasses the need for a separate, standalone MCP client if you are already using the Claude Messages API.

**Key features of this integration:**

*   **Direct API Calls**: You configure connections to MCP servers by including the `mcp_servers` parameter in your API requests to Claude.
*   **Tool Calling**: The primary MCP functionality currently supported through this connector is tool usage.
*   **Accessibility**: The target MCP server needs to be publicly accessible over HTTP.

This approach can simplify your architecture if you're building applications that programmatically interact with Claude and need to leverage MCP-enabled tools without managing an additional client layer.

For complete details, API examples, and configuration options, please consult the [official Anthropic MCP connector documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector).

## Integrate with AI Agents

Modern AI agent frameworks can connect directly to the Keboola MCP Server and expose all of its tools inside your
agents. This unlocks fully automated data workflows driven by natural-language instructions.

### OpenAI Agents SDK (Python)

The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/) ships with first-class MCP support. Simply
start the Keboola MCP Server (locally via `uvx` or remotely over Streamable HTTP) and register it with the SDK:

```python
from openai_agents_python import Agent
from openai_agents_python.mcp import MCPServerStdio

async with MCPServerStdio(
    params={"command": "uvx", "args": ["keboola_mcp_server"]}
) as mcp:
    agent = Agent(
        name="Assistant",
        instructions="Use the Keboola tools to achieve the task",
        mcp_servers=[mcp],
    )
    await agent.run("Load yesterday's CSV into Snowflake")
```

The SDK automatically calls `list_tools()` on the server, making every Keboola operation available to the model.

### LangChain

[LangChain](https://python.langchain.com/docs/) does not yet include a built-in MCP connector, but you can integrate by:

1. Running the Keboola MCP Server, or attaching to our deployed instance `https://mcp.REGION.keboola.com`.
2. Mapping each entry from `list_tools()` to a `Tool` in LangChain.
3. Adding those tools to an `AgentExecutor`.

Because the server returns standard JSON schemas, the mapping is straightforward and can be handled with a
lightweight wrapper. Native MCP support is already under discussion in the LangChain community.

### Other frameworks
* **[Crew AI](https://crewai.com)** – Provide crew members with Keboola tool definitions and route tool invocations through the MCP server.

## Integrate with Your Own MCP Client

If you are developing your own MCP client or integrating MCP capabilities into a custom application, you can connect to the Keboola MCP Server. The server supports standard MCP communication protocols.

For detailed instructions and SDKs for building your own MCP client, refer to the official [Model Context Protocol documentation for client developers](https://modelcontextprotocol.io/quickstart/client).

Information on supported transports (e.g., `stdio`, `Streamable HTTP`) is provided in the 'MCP Server Capabilities' section below. For more details on the Keboola MCP server, including how it can be run and configured for custom client integration, please refer to its [GitHub repository](https://github.com/keboola/mcp-server).

## MCP Server Capabilities

The Keboola MCP Server supports several core concepts of the Model Context Protocol. Here's a summary:

| Concept     | Supported | Notes                                                                                                  |
|-------------|-----------|--------------------------------------------------------------------------------------------------------|
| Transports  | ✅        | Supports `stdio` and `Streamable HTTP` (recommended) for client communication. SSE is deprecated and will be removed on 01.04.2026. |
| Prompts     | ✅        | Processes natural language prompts from MCP clients to interact with Keboola.                          |
| Tools       | ✅        | Provides a rich set of tools for storage operations, component management, SQL execution, job control. |
| Resources   | ❌        | Exposing Keboola project entities (data, configurations, etc.) as formal MCP Resources is not currently supported.      |
| Sampling    | ❌        | Advanced sampling techniques are not explicitly supported by the server itself.                        |
| Roots       | ❌        | The concept of 'Roots' as defined in general MCP is not a specific feature of the Keboola MCP server.  |

## Tool Authorization and Access Control

When connecting to the [Keboola MCP Server](/ai/mcp-server/) via HTTP-based transports (Streamable HTTP recommended; SSE is deprecated), you can control which tools are available to clients using HTTP headers. This is useful for restricting AI agent capabilities, enforcing compliance policies, or providing customer-specific access controls.

<div class="clearfix"></div><div class="alert alert-info">
<b>Note:</b> Tool authorization headers only apply to HTTP-based transports. They are not available when using the <code>stdio</code> transport for local execution.
</div>

### Authorization Headers

The following HTTP headers control tool access:

| Header | Description | Example Value |
|--------|-------------|---------------|
| `X-Allowed-Tools` | Comma-separated list of tool names to allow. Only these tools will be available. | `get_configs,get_buckets,query_data` |
| `X-Disallowed-Tools` | Comma-separated list of tool names to exclude. These tools will be removed from the available set. | `create_config,run_job` |
| `X-Read-Only-Mode` | When set to `true`, `1`, or `yes`, restricts access to read-only tools only. | `true` |

### Filter Behavior

When multiple headers are present, filters are applied in the following order:

1. **Allowed tools filter**: If `X-Allowed-Tools` is specified, only those tools are initially available.
2. **Read-only intersection**: If `X-Read-Only-Mode` is enabled, the available tools are intersected with the read-only tools set.
3. **Disallowed exclusion**: Tools listed in `X-Disallowed-Tools` are removed from the final set.

Empty headers are treated as no restriction/exclusion (backward compatible behavior).

### Read-Only Tools

The following 15 tools are classified as read-only (they do not modify data):

| Category | Tools |
|----------|-------|
| Components | `get_configs`, `get_components`, `get_config_examples` |
| Flows | `get_flows`, `get_flow_examples`, `get_flow_schema` |
| Storage | `get_buckets`, `get_tables` |
| SQL | `query_data` |
| Data Apps | `get_data_apps` |
| Jobs | `get_jobs` |
| Search | `search`, `find_component_id` |
| Project | `get_project_info` |
| Documentation | `docs_query` |

### Use Cases

**AI Agent Restrictions**: When integrating AI agents (like Devin, Cursor, or custom agents) with your Keboola project, you may want to limit their capabilities. For example, allowing an agent to query and explore data but preventing it from creating or modifying configurations:

```
X-Read-Only-Mode: true
```

**Compliance and Security**: For environments with strict data governance requirements, you can create customer-specific access profiles. For example, allowing only specific tools while explicitly blocking others:

```
X-Allowed-Tools: get_buckets,get_tables,query_data,search
X-Disallowed-Tools: run_job
```

**Combined Restrictions**: You can combine all three headers for fine-grained control. For example, to allow only a subset of read-only tools:

```
X-Allowed-Tools: get_configs,get_buckets,get_tables,query_data,create_config
X-Read-Only-Mode: true
X-Disallowed-Tools: query_data
```

This configuration would result in only `get_configs`, `get_buckets`, and `get_tables` being available (the intersection of allowed and read-only, minus the disallowed).

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
            "-it",
            "--rm",
            "-e", "KBC_STORAGE_TOKEN",
            "-e", "KBC_WORKSPACE_SCHEMA",
            "keboola/mcp-server:latest",
            "--api-url", "https://connection.YOUR_REGION.keboola.com"
          ],
          "env": {
            "KBC_STORAGE_TOKEN": "YOUR_KEBOOLA_STORAGE_TOKEN",
            "KBC_WORKSPACE_SCHEMA": "YOUR_WORKSPACE_SCHEMA"
          }
        }
      }
    }
    ```

    **Note:**
    * Ensure Docker is running on your system.
    * Replace placeholders like `YOUR_KEBOOLA_STORAGE_TOKEN`, `YOUR_WORKSPACE_SCHEMA`, and the Keboola API URL.
    * The client (Cursor) passes the `KBC_STORAGE_TOKEN` and `KBC_WORKSPACE_SCHEMA` from its `env` block to the `docker run` command through the `-e` flags. The `--api-url` is passed directly as an argument to the `keboola/mcp-server` entrypoint.

## Running Keboola MCP Server Locally Using uv command

While MCP clients like Cursor or Claude typically manage the MCP server automatically, you might want to run the Keboola MCP Server locally for development, testing, or when using a custom client.

The primary way to run the server locally is by using `uv` or `uvx` to execute the `keboola_mcp_server` package. More information about the server is available in its [Keboola MCP Server GitHub repository](https://github.com/keboola/mcp-server). Make sure you have Python 3.10+ and `uv` installed.

1. **Set up environment variables:**  
   Before running the server, you need to configure the following environment variables:
   * `KBC_STORAGE_TOKEN`: Your Keboola Storage API token.
   * `KBC_WORKSPACE_SCHEMA`: Your Keboola project's workspace schema (for SQL queries).
   * `KBC_API_URL`: Your Keboola instance API URL (e.g., `https://connection.keboola.com` or `https://connection.YOUR_REGION.keboola.com`).

   Refer to the [Keboola Tokens](https://help.keboola.com/management/project/tokens/) and [Keboola workspace manipulation](https://help.keboola.com/tutorial/manipulate/workspace/) for detailed instructions on obtaining these values.

   **1.1. Additional Setup for BigQuery Users**  
   If your Keboola project uses BigQuery as its backend, you will also need to set up the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. This variable should point to the JSON file containing your Google Cloud service account key that has the necessary permissions to access your BigQuery data.

   Example:  
   `GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`

2. **Run the server:**

```bash
uvx keboola_mcp_server --api-url $KBC_API_URL
```

The `KBC_API_URL` was set as an environment variable but can also be provided manually. The command starts the server communicating via `stdio`. To run the server in `Streamable HTTP` mode (listening on a network host/port such as `localhost:8000`), pass the appropriate flags to `keboola_mcp_server`. For day-to-day use with clients like Claude or Cursor you usually do not need to run this command manually, as they handle the server lifecycle.

### Connecting a Client to a Localhost Instance

When you run the Keboola MCP Server manually, it will typically listen on `stdio` or on a specific HTTP port if configured for `Streamable HTTP`.

* **`stdio`-based clients:** Configure the client application to launch the local `keboola_mcp_server` executable and communicate over standard input/output.
* **`Streamable HTTP`-based clients:** If you start the server in HTTP mode, your client should connect to the specified host and port (e.g., `http://localhost:8000/mcp?storage_token=XXX&workspace_schema=YYY`).

## Using the Keboola Remote Server Deployment

Keboola MCP Server is also hosted in every multi-tenant stack with OAuth authentication support. In case your AI assistant supports remote connection and OAuth, 
you can connect to Keboola's MCP Server by following these steps:

<div class="clearfix"></div><div class="alert alert-warning">
<b>Note</b> that when using the remote server with OAuth, you will get the permissions that match the user's role in Keboola. 
At this moment, <b>if you wish to control permissions more granularly</b>, it is recommended to use the local deployment and specify your own <b>Storage Token</b> and <b>Workspace Schema.</b>
</div>
1. Obtain the remote server URL of the stack `https://mcp.<YOUR_REGION>.keboola.com/mcp`.
   - You can find the URL in your Keboola [project settings](/management/project/), e.g. navigate to `Users & Settings` > `MCP Server`
     - In there you can also find specific instructions for various clients.
2. Copy the server URL and paste it into your AI assistant's settings.
3. Once you save the settings and refresh your AI assistant, you will be prompted to authenticate with your Keboola account and select the project you want to connect to.

### Remote Server Setup via mcp-remote adapter

Some of the AI Assistants or MCP Clients do not support the remote OAuth connection yet. 
In that case you can still connect to the remote instance using the [`mcp-remote`](https://github.com/geelen/mcp-remote) adapter.


1. **Make sure you have [Node.js](https://nodejs.org/) installed.**
   - **macOS**
   ```bash
   brew install node
   ```
   - **Windows**
     -  Go to: [https://nodejs.org](https://nodejs.org)
     - Download the **LTS** version (recommended)
     - Run the Installer, ensure "npm package manager" is selected

2. **Configure your client using mcp.json:**

    ```json
    {
      "mcpServers": {
        "keboola": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "https://mcp.<YOUR_REGION>.keboola.com/mcp"
          ]
        }
      }
    }
    ```
3. **Log in**

Once you save the settings and refresh your AI assistant, you will be prompted to authenticate with your Keboola account and select the project you want to connect to.

## Cursor IDE Connection Example

If you are running the Keboola MCP Server locally using `uvx`, you can configure Cursor IDE to connect to this local instance. This is useful for development or testing with a custom server build.

**Manual setup:**

1. **Open Cursor settings.**
2. **Navigate to the MCP section within settings.**
3. **Add or configure your Keboola project.** Provide your `KBC_STORAGE_TOKEN`, `KBC_WORKSPACE_SCHEMA` and the API URL.

Example `mcp_servers.json` snippet:

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

> You can use this link to get the above configuration template into your Cursor: [![Install MCP Server using uvx](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJjb21tYW5kIjoidXZ4IGtlYm9vbGFfbWNwX3NlcnZlciAtLWFwaS11cmwgaHR0cHM6Ly9jb25uZWN0aW9uLllPVVJfUkVHSU9OLmtlYm9vbGEuY29tIiwiZW52Ijp7IktCQ19TVE9SQUdFX1RPS0VOIjoieW91cl9rZWJvb2xhX3N0b3JhZ2VfdG9rZW4iLCJLQkNfV09SS1NQQUNFX1NDSEVNQSI6InlvdXJfd29ya3NwYWNlX3NjaGVtYSJ9fQ%3D%3D)

**Remote setup**

**Alternatively**, click the button related to your region to use the remote deployment:

| Stack (Region)                  | Cursor Deeplink                                                                                                                                                                                                         |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| US Virginia AWS (default)       | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5rZWJvb2xhLmNvbS9tY3AifQ%3D%3D)                       |
| US Virginia GCP (us-east4)      | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC51cy1lYXN0NC5nY3Aua2Vib29sYS5jb20vbWNwIn0%3D)         |
| EU Frankfurt AWS (eu-central-1) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldS1jZW50cmFsLTEua2Vib29sYS5jb20vbWNwIn0%3D)         |
| EU Ireland Azure (north-europe) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ub3J0aC1ldXJvcGUuYXp1cmUua2Vib29sYS5jb20vbWNwIn0%3D) |
| EU Frankfurt GCP (europe-west3) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldXJvcGUtd2VzdDMuZ2NwLmtlYm9vbGEuY29tL21jcCJ9)       |

Always refer to your MCP client's documentation for the most up-to-date instructions on configuring external MCP servers.
