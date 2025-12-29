# Nakama Game Server

A game server built with [Nakama](https://heroiclabs.com/) using Go runtime modules.

## Prerequisites

- Docker and Docker Compose
- Go 1.25.0 (for local development)

## Project Structure

```
.
├── api/
│   ├── main.go           # Go module with InitModule function
│   ├── go.mod            # Go dependencies
│   ├── go.sum
│   ├── vendor/           # Vendored dependencies
│   ├── Dockerfile        # Multi-stage build for Go plugin
│   └── local.yml         # Nakama configuration
├── nakama/
│   └── data/             # Nakama data directory
├── docker-compose.yml    # Docker services configuration
└── watch.sh              # Auto-reload script
```

## Getting Started

### 1. Start the Server

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d
```

The server will be available at:
- gRPC: `localhost:7349`
- HTTP API: `localhost:7350`
- Console: `localhost:7351`

### 2. View Logs

```bash
# Follow all logs
docker compose logs -f

# Follow only Nakama logs
docker compose logs -f nakama
```

### 3. Stop the Server

```bash
docker compose down
```

## Development Workflow

### Option 1: Docker Compose Watch (Recommended)

Automatically rebuilds and restarts when you modify Go files:

```bash
docker compose watch
```

Now edit `api/main.go` and save - the server will automatically rebuild and restart.

### Option 2: Manual Watch Script

If Docker Compose watch is not available:

```bash
# Terminal 1: Run services
docker compose up

# Terminal 2: Run watch script
./watch.sh
```

### Manual Rebuild

```bash
# Rebuild and restart after code changes
docker compose build nakama
docker compose restart nakama
```

## Writing Go Modules

The `InitModule` function in `api/main.go` is the entry point for your game logic:

```go
func InitModule(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, initializer runtime.Initializer) error {
    // Register RPCs, hooks, and other game logic here
    logger.Info("Module initialized!")
    return nil
}
```

### Key Points

- Function signature must match exactly
- Use `package main`
- Import `github.com/heroiclabs/nakama-common/runtime` for Nakama APIs
- All dependencies must be vendored (`go mod vendor`)

### Adding Dependencies

```bash
cd api/
go get <package>
go mod tidy
go mod vendor
```

Then rebuild the Docker container.

## Configuration

Edit `api/local.yml` to configure Nakama:

```yaml
logger:
  level: "DEBUG"
```

See [Nakama Configuration](https://heroiclabs.com/docs/nakama/getting-started/configuration/) for all options.

## Database

PostgreSQL is included and automatically configured:

- Host: `postgres:5432` (from Nakama container)
- Database: `nakama`
- User: `postgres`
- Password: `localdb`

Access from host machine: `localhost:5432`

## Troubleshooting

### "Error reading InitModule function"

Make sure your `InitModule` function has the correct signature with all parameters including `db *sql.DB`.

### Version Mismatch Errors

Ensure `nakama-common` version matches Nakama version:
- Nakama 3.35.1 requires `nakama-common v1.44.0`

### Plugin Build Errors

The Go version in the builder must match the runtime. Both are using Go 1.25.0.

## Resources

- [Nakama Documentation](https://heroiclabs.com/docs/nakama/)
- [Go Runtime Guide](https://heroiclabs.com/docs/nakama/server-framework/go-runtime/)
- [Nakama Common API](https://pkg.go.dev/github.com/heroiclabs/nakama-common/runtime)
