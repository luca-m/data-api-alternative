# Atlas Data API Alternative

A production-ready Node.js service that replicates the MongoDB Atlas Data API experience with first-class developer ergonomics, observability, and security. Deploy it to any Node-compatible runtime and start orchestrating data flows over HTTPS without bundling a driver.

## Table of Contents
- [Why This Project](#why-this-project)
- [Features at a Glance](#features-at-a-glance)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Available Endpoints](#available-endpoints)
- [Operational Notes](#operational-notes)
- [Contributing](#contributing)
- [License](#license)

## Why This Project
MongoDB deprecated the legacy Atlas Data API, but many teams still need a simple HTTPS façade in front of Atlas clusters. This project delivers a modern, self-hosted alternative built on the official MongoDB Node.js driver. It is ideal for:

- Integrations that require REST-style endpoints instead of driver access.
- Serverless or edge workloads that expect stateless HTTP interfaces.
- Teams that need auditable, customizable request pipelines.

## Features at a Glance
- **Full CRUD Coverage** – Implementations for `insertOne`, `find`, `findOne`, `updateOne`, `deleteOne`, and `aggregate` mirror the Data API surface area.
- **API Key Security** – Validates inbound requests with an API key and secret pair stored server-side.
- **Rate Limiting** – Protects your cluster with a configurable window-based limiter.
- **Structured Logging** – JSON logs make it easy to plug into observability stacks.
- **Dynamic Models** – Generates Mongoose models on the fly to keep schemas flexible.

## Architecture Overview
```
Client → Express Router → Authentication Middleware → Rate Limiter → Controller → MongoDB Atlas
```
- **`routes/api.js`** wires HTTP verbs to controller logic.
- **`controllers/dbController.js`** normalizes and forwards Data API requests to the MongoDB driver.
- **`models/dynamicModel.js`** materializes the appropriate Mongoose model per collection.
- **`utils`** contains cross-cutting helpers such as logging utilities.

## Prerequisites
- **Node.js** 18 or newer.
- **MongoDB Atlas cluster** (or compatible connection string).
- **Environment variables** stored in `.env`.

## Quick Start
```bash
# Install dependencies
git clone https://github.com/abhishekmongoDB/data-api-alternative.git
cd data-api-alternative
npm install

# Start the development server
npm run dev
```

The server listens on the port defined in `PORT` (defaults to `7438`).

## Configuration
Create a `.env` file in the project root and define the following variables:

```ini
PORT=7438
MONGO_URI="mongodb+srv://..."
API_KEY="your_public_key"
API_SECRET="your_private_secret"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_MESSAGE="Too many requests, please try again later."
```

You can adjust rate-limit thresholds and the warning message to fit your deployment profile. Rotate the API key and secret regularly for best security hygiene.

## Available Endpoints
| Endpoint | Description |
| --- | --- |
| `POST /api/insertOne` | Inserts a single document. |
| `POST /api/findOne` | Retrieves the first document matching a filter. |
| `POST /api/find` | Returns an array of matching documents. |
| `POST /api/updateOne` | Updates a single document with optional upsert. |
| `POST /api/deleteOne` | Deletes a single document that matches the filter. |
| `POST /api/aggregate` | Executes an aggregation pipeline. |

All endpoints expect a JSON payload that specifies the target `database`, `collection`, and operation-specific parameters. Authentication headers:

```http
x-api-key: <API_KEY>
x-api-secret: <API_SECRET>
```

## Usage Examples

### Insert One Document
```bash
curl -X POST http://localhost:7438/api/insertOne \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "x-api-secret: $API_SECRET" \
  -d '{
    "database": "sample_db",
    "collection": "sample_collection",
    "document": { "key": "value" }
  }'
```

### Find Documents with Projection and Sort
```bash
curl -X POST http://localhost:7438/api/find \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "x-api-secret: $API_SECRET" \
  -d '{
    "database": "sample_db",
    "collection": "orders",
    "filter": { "status": "open" },
    "projection": { "_id": 0, "status": 1, "total": 1 },
    "sort": { "createdAt": -1 },
    "limit": 10
  }'
```

### Aggregate by Status
```bash
curl -X POST http://localhost:7438/api/aggregate \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "x-api-secret: $API_SECRET" \
  -d '{
    "database": "sample_db",
    "collection": "orders",
    "pipeline": [
      { "$match": { "status": { "$in": ["open", "closed"] } } },
      { "$group": { "_id": "$status", "totalSales": { "$sum": "$total" } } }
    ]
  }'
```

## Operational Notes
- **Logging** – Review the logs emitted by `utils/logging.js` for request traces and error diagnostics.
- **Error Handling** – Responses include informative error messages and HTTP status codes to simplify client-side handling.
- **Deployment** – The project ships with a `vercel.json` example, but any Node-compatible hosting platform (Render, Railway, Fly.io, etc.) will work.
- **Security** – Never check secrets into version control and prefer storing them in a secrets manager for production deployments.

## Contributing
Bug reports, feature requests, and pull requests are welcome. Please open an issue to discuss substantial changes before submitting a PR.

## License
This project is licensed under the [MIT License](./LICENSE).
