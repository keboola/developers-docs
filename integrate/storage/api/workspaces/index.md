---
title: Workspaces API
permalink: /integrate/storage/api/workspaces/
---

* TOC
{:toc}

This guide provides comprehensive instructions for third-party applications and LLMs to interact with Keboola workspaces via the Storage API. Workspaces are temporary isolated environments for data analysis and transformations, providing direct database access with credentials.

## Prerequisites

Before working with workspaces, you need the following:

**Storage API Token**: A valid token with appropriate permissions for the project. The token must be passed in the `X-StorageApi-Token` HTTP header for all API requests. See [Storage Tokens](https://help.keboola.com/storage/tokens/) for details on obtaining and managing tokens.

**Stack URL**: The base URL for your Keboola stack. This varies by region and deployment type. Common multi-tenant stacks include `connection.keboola.com` (US Virginia AWS), `connection.eu-central-1.keboola.com` (EU Frankfurt AWS), `connection.north-europe.azure.keboola.com` (EU Ireland Azure), and `connection.us-east4.gcp.keboola.com` (US Virginia GCP). For single-tenant deployments, the format is typically `connection.CUSTOMER_NAME.keboola.com`.

## Discovering the Workspaces API Endpoint

The Workspaces API (also known as Sandboxes API) endpoint can be discovered dynamically using the Storage API Index call. This is the recommended approach for applications that need to work across different Keboola stacks.

{% highlight bash %}
curl --request GET \
  --url 'https://connection.keboola.com/v2/storage' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

The response includes a `services` array containing all available service endpoints:

{% highlight json %}
{
  "services": [
    {
      "id": "sandboxes",
      "url": "https://sandboxes.keboola.com"
    }
  ]
}
{% endhighlight %}

The `sandboxes` service provides the Workspaces API endpoint. For the full API documentation, visit [Workspaces API Documentation](https://sandboxes.keboola.com/documentation).

## Listing Workspaces

To retrieve all workspaces in a project that the storage token has access to, use the following endpoint:

{% highlight bash %}
curl --request GET \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

The response returns an array of workspace objects:

{% highlight json %}
[
  {
    "id": 123456,
    "type": "table",
    "name": "WORKSPACE_123456",
    "component": "keboola.snowflake-transformation",
    "configurationId": "789012",
    "created": "2024-01-15T10:30:00+00:00",
    "connection": {
      "backend": "snowflake",
      "region": "us-east-1",
      "host": "keboola.snowflakecomputing.com",
      "database": "SAPI_1234",
      "schema": "WORKSPACE_123456",
      "warehouse": "KEBOOLA_PROD",
      "user": "SAPI_WORKSPACE_123456",
      "loginType": "password",
      "ssoLoginAvailable": false
    },
    "backendSize": "small",
    "statementTimeoutSeconds": 7200,
    "creatorToken": {
      "id": 456,
      "description": "My API Token"
    },
    "readOnlyStorageAccess": true,
    "platformUsageType": null
  }
]
{% endhighlight %}

### Response Fields

Each workspace object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier of the workspace |
| `type` | string | Type of workspace: `table` (database) or `file` (file storage) |
| `name` | string | Name of the workspace (schema name for table type) |
| `component` | string | ID of the component that created the workspace (nullable) |
| `configurationId` | string | ID of the configuration that created the workspace (nullable) |
| `created` | string | ISO 8601 timestamp of workspace creation |
| `connection` | object | Connection details (structure varies by backend type) |
| `backendSize` | string | Size of the backend (e.g., `small`, `medium`, `large`) |
| `statementTimeoutSeconds` | integer | Query timeout in seconds |
| `creatorToken` | object | Information about the token that created the workspace |
| `readOnlyStorageAccess` | boolean | Whether read-only storage access is enabled |
| `platformUsageType` | string | Platform usage type (nullable) |

### Connection Object for Table Workspaces

For table-type workspaces (Snowflake, BigQuery, Redshift), the connection object includes:

| Field | Type | Description |
|-------|------|-------------|
| `backend` | string | Backend type: `snowflake`, `bigquery`, or `redshift` |
| `host` | string | Database host URL |
| `database` | string | Database name |
| `schema` | string | Schema name |
| `warehouse` | string | Warehouse name (Snowflake only) |
| `user` | string | Username for authentication |
| `loginType` | string | Authentication method (e.g., `password`, `keypair`) |
| `ssoLoginAvailable` | boolean | Whether SSO login is available |
| `region` | string | Cloud region (nullable) |

### Connection Object for File Workspaces

For file-type workspaces (Azure Blob Storage), the connection object includes:

| Field | Type | Description |
|-------|------|-------------|
| `backend` | string | File storage backend type (e.g., `azure`) |
| `container` | string | Container name |
| `region` | string | Cloud region (nullable) |

## Getting Workspace Details

To retrieve details for a specific workspace:

{% highlight bash %}
curl --request GET \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces/{workspaceId}' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

Replace `{workspaceId}` with the numeric ID of the workspace. The response structure is identical to a single item from the list workspaces response.

## Creating a Workspace

To create a new workspace:

{% highlight bash %}
curl --request POST \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "backend": "snowflake",
    "backendSize": "small",
    "readOnlyStorageAccess": true
  }'
{% endhighlight %}

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `backend` | string | No | Backend type (`snowflake`, `bigquery`, `redshift`). Defaults to project's default backend. |
| `backendSize` | string | No | Size of the workspace backend. |
| `readOnlyStorageAccess` | boolean | No | Enable read-only access to project storage. |
| `loginType` | string | No | Authentication type (e.g., `password`, `keypair`). |
| `networkPolicy` | string | No | Network policy for the workspace. |

### Asynchronous Creation

For long-running workspace creation, use the `async=true` query parameter:

{% highlight bash %}
curl --request POST \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces?async=true' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "backend": "snowflake"
  }'
{% endhighlight %}

This returns a job object with HTTP status 202. Poll the job status to determine when the workspace is ready.

## Resetting Workspace Password

To reset the password for a workspace and obtain new credentials:

{% highlight bash %}
curl --request POST \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces/{workspaceId}/password' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

The response includes the new password:

{% highlight json %}
{
  "password": "new_generated_password_here"
}
{% endhighlight %}

For BigQuery workspaces, the response includes a credentials object instead:

{% highlight json %}
{
  "credentials": {
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "service-account@project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
{% endhighlight %}

For file workspaces (Azure Blob Storage), the response includes a connection string:

{% highlight json %}
{
  "connectionString": "DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
}
{% endhighlight %}

### Password Reset Limitations

Password reset is only supported for workspaces with `loginType` set to `password`. Workspaces using key-pair authentication require setting a public key instead.

## Obtaining Workspace Credentials

For applications that need to store and reuse workspace credentials, there are two approaches:

### Approach 1: Create Workspace with Credentials

When creating a workspace, the response includes the initial credentials (password, credentials object, or connection string depending on the backend type). Store these securely for future use.

### Approach 2: Create Additional Credentials

For Snowflake and BigQuery workspaces, you can create additional credentials:

{% highlight bash %}
curl --request POST \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces/{workspaceId}/credentials' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

This endpoint creates new credentials if they don't exist, or returns existing credentials. The response includes the full workspace details with the secret (password or credentials).

### Approach 3: Reset Password

If credentials are lost or need rotation, use the password reset endpoint described above. This generates new credentials and invalidates the previous ones.

## Setting Public Key for Key-Pair Authentication

For workspaces using key-pair authentication (Snowflake):

{% highlight bash %}
curl --request POST \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces/{workspaceId}/public-key' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----"
  }'
{% endhighlight %}

## Deleting a Workspace

To delete a workspace:

{% highlight bash %}
curl --request DELETE \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/workspaces/{workspaceId}' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

For asynchronous deletion, add `?async=true` to the URL.

## Working with Development Branches

Workspaces are branch-aware. To work with workspaces in a specific development branch, include the branch ID in the URL path:

{% highlight bash %}
# List workspaces in a specific branch
curl --request GET \
  --url 'https://connection.YOUR_REGION.keboola.com/v2/storage/branch/{branchId}/workspaces' \
  --header 'X-StorageApi-Token: YOUR_STORAGE_TOKEN'
{% endhighlight %}

## Error Handling

The API returns standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (workspace created successfully) |
| 202 | Accepted (async job queued) |
| 400 | Bad Request (invalid parameters) |
| 401 | Unauthorized (invalid or missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (workspace doesn't exist) |
| 422 | Unprocessable Entity (unsupported backend) |

Error responses include a JSON body with details:

{% highlight json %}
{
  "error": "Workspace not found",
  "code": "storage.workspaces.notFound"
}
{% endhighlight %}

## Best Practices for Third-Party Applications

When building applications that integrate with Keboola workspaces, consider the following best practices.

**Credential Storage**: Store workspace credentials securely using encryption at rest. Never log or expose credentials in plain text. Consider using a secrets management service.

**Token Scoping**: Use storage tokens with minimal required permissions. Create dedicated tokens for workspace operations rather than using admin tokens.

**Credential Rotation**: Implement regular credential rotation using the password reset endpoint. Handle credential expiration gracefully by detecting authentication failures and triggering a reset.

**Connection Pooling**: For database workspaces, implement connection pooling to efficiently manage database connections and respect the `statementTimeoutSeconds` limit.

**Error Recovery**: Implement retry logic with exponential backoff for transient failures. Handle workspace not found errors by checking if the workspace was deleted.

**Cleanup**: Delete workspaces when they are no longer needed to free up resources and reduce costs.

## Example: Complete Workflow

Here's a complete example workflow for a third-party application:

{% highlight python %}
import requests

class KeboolaWorkspaceClient:
    def __init__(self, stack_url, storage_token):
        self.base_url = f"https://{stack_url}/v2/storage"
        self.headers = {
            "X-StorageApi-Token": storage_token,
            "Content-Type": "application/json"
        }
    
    def list_workspaces(self):
        """List all workspaces in the project."""
        response = requests.get(
            f"{self.base_url}/workspaces",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def get_workspace(self, workspace_id):
        """Get details for a specific workspace."""
        response = requests.get(
            f"{self.base_url}/workspaces/{workspace_id}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def create_workspace(self, backend="snowflake", size="small"):
        """Create a new workspace and return credentials."""
        response = requests.post(
            f"{self.base_url}/workspaces",
            headers=self.headers,
            json={
                "backend": backend,
                "backendSize": size,
                "readOnlyStorageAccess": True
            }
        )
        response.raise_for_status()
        return response.json()
    
    def reset_password(self, workspace_id):
        """Reset workspace password and return new credentials."""
        response = requests.post(
            f"{self.base_url}/workspaces/{workspace_id}/password",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def delete_workspace(self, workspace_id):
        """Delete a workspace."""
        response = requests.delete(
            f"{self.base_url}/workspaces/{workspace_id}",
            headers=self.headers
        )
        response.raise_for_status()

# Usage example
client = KeboolaWorkspaceClient(
    stack_url="connection.keboola.com",
    storage_token="your-storage-token"
)

# List existing workspaces
workspaces = client.list_workspaces()
print(f"Found {len(workspaces)} workspaces")

# Create a new workspace
workspace = client.create_workspace(backend="snowflake", size="small")
print(f"Created workspace {workspace['id']}")

# Store connection details
connection = workspace["connection"]
password = workspace["connection"].get("password")

# Later, if credentials are lost, reset them
new_creds = client.reset_password(workspace["id"])
new_password = new_creds["password"]
{% endhighlight %}

## Next Steps

- [Storage API Documentation](https://keboola.docs.apiary.io/)
- [Workspaces API Documentation](https://sandboxes.keboola.com/documentation)
- [Learn more about Workspaces](https://help.keboola.com/transformations/workspace/)
- [Storage Tokens](https://help.keboola.com/storage/tokens/)
