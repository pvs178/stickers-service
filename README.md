# Stickers Service

Real-time collaborative sticky notes service with REST API and WebSocket support.

## Features

- **REST API** - Full CRUD operations for stickers
- **Real-time Updates** - WebSocket events for live collaboration
- **Validation** - DTO validation with detailed error messages
- **Rate Limiting** - API rate limiting (60 req/min)
- **CORS** - Configurable CORS support
- **Health Check** - Database and service health monitoring
- **API Versioning** - `/api/v1` structure

## Tech Stack

- TypeScript
- Express.js
- Socket.IO
- TypeORM
- PostgreSQL
- class-validator

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stickers_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
CORS_ORIGIN=*
```

### Database Setup

```bash
npm run migration:run
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Testing

1. Import `insomnia-collection.json` into Insomnia/Postman
2. Ensure database is running and migrations are applied
3. Start the server: `npm start`
4. Create a test board in database (ID: `550e8400-e29b-41d4-a716-446655440000`)
5. Use collection requests in order (1→2→3...)

## WebSocket Testing

WebSocket events are automatically emitted when using REST API. To verify:

1. Check server logs - you'll see WebSocket connections and events
2. Use browser DevTools or Postman WebSocket feature to connect to `ws://localhost:3000`
3. Emit `join:board` event with boardId
4. Create/update/delete stickers via REST API
5. Observe real-time events: `sticker:created`, `sticker:updated`, `sticker:deleted`

## API Endpoints

### Health Check

```
GET /health
```

### Stickers

**List stickers**
```
GET /api/v1/stickers?boardId={uuid}
```

**Get sticker**
```
GET /api/v1/stickers/:id
```

**Create sticker**
```
POST /api/v1/stickers
Content-Type: application/json

{
  "boardId": "uuid",
  "content": "string",
  "positionX": number,
  "positionY": number,
  "color": "string" (optional),
  "userId": "uuid" (optional)
}
```

**Update sticker**
```
PUT /api/v1/stickers/:id
Content-Type: application/json

{
  "content": "string" (optional),
  "positionX": number (optional),
  "positionY": number (optional),
  "color": "string" (optional)
}
```

**Delete sticker**
```
DELETE /api/v1/stickers/:id
```

## Error Codes

- `VALIDATION_ERROR` - Invalid request data (400)
- `STICKER_NOT_FOUND` - Sticker not found (404)
- `BOARD_NOT_FOUND` - Board not found (404)
- `RATE_LIMIT_EXCEEDED` - Too many requests (429)
- `INTERNAL_ERROR` - Server error (500)

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm run lint:fix
npm run migration:generate
npm run migration:run
npm run migration:revert
```

