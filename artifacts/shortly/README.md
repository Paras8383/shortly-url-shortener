# Shortly

Shortly is a responsive React + Vite URL shortener frontend. It validates long URLs, creates a short link through a mock fallback, and is ready to connect to an AWS API Gateway endpoint through `VITE_API_URL`.

## Run locally

From the workspace root:

```bash
pnpm install
pnpm --filter @workspace/shortly run dev
```

The app expects the Replit workflow to provide `PORT` and `BASE_PATH`. For a standalone Vite session, use the artifact workflow or provide those environment variables yourself.

## Connect the AWS API

Create `artifacts/shortly/.env.local`:

```bash
VITE_API_URL=https://your-api-gateway.example.com
```

When configured, Shortly sends:

```http
POST ${VITE_API_URL}/shorten
Content-Type: application/json
```

with:

```json
{
  "url": "https://example.com/very/long/url"
}
```

The API should return:

```json
{
  "shortUrl": "https://example.com/aB72x"
}
```

Without `VITE_API_URL`, the app uses a deterministic local mock so the full UI can be demonstrated without a backend.