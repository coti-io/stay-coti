# COTI Community Platform

A monorepo containing the COTI Community Platform frontend and backend applications.

## Project Structure

```
stay-coti/
├── apps/
│   ├── backend/          # Express.js API (@coti-community/backend)
│   └── frontend/         # Next.js Web App (@coti-community/frontend)
├── packages/
│   └── shared/           # Shared types and constants (@coti-community/shared)
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Full stack Docker setup
├── docker-compose.dev.yml # Development services (MySQL, Redis)
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn 4+ (via Corepack)
- Docker & Docker Compose (optional, for local services)

### Setup

1. **Enable Corepack (for Yarn 4)**
   ```bash
   corepack enable
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development services (MySQL & Redis)**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Setup environment files**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

5. **Start development servers**
   ```bash
   # Start both frontend and backend
   yarn dev

   # Or start individually
   yarn dev:backend   # Backend on http://localhost:3000
   yarn dev:frontend  # Frontend on http://localhost:3001
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start all apps in development mode |
| `yarn dev:backend` | Start backend only |
| `yarn dev:frontend` | Start frontend only |
| `yarn build` | Build all apps |
| `yarn build:backend` | Build backend only |
| `yarn build:frontend` | Build frontend only |
| `yarn start` | Start all apps in production mode |
| `yarn lint` | Lint all packages |
| `yarn typecheck` | Type check all packages |
| `yarn format` | Format all files with Prettier |
| `yarn clean` | Clean all build outputs |

## Docker

### Development (services only)
```bash
# Start MySQL and Redis
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Full Stack
```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

## Architecture

### Backend (`@coti-community/backend`)
- **Framework**: Express.js with TypeScript
- **ORM**: TypeORM with MySQL
- **Cache**: Redis
- **Auth**: JWT + Web3 wallet signatures
- **CMS**: DatoCMS integration

### Frontend (`@coti-community/frontend`)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query
- **Web3**: Wagmi + ConnectKit
- **3D**: Three.js + React Three Fiber

### Shared (`@coti-community/shared`)
- Common TypeScript types
- Shared constants
- Network configurations

## Configuration

### Environment Variables

#### Backend (`apps/backend/.env`)
```env
NODE_ENV=development
PORT=3000
MASTER_DB={"host":"localhost","port":3306,...}
SLAVES_DB=[...]
JWT={"accessSecret":"...","accessExpiresIn":86400}
REDIS={"host":"localhost","port":6379}
DATO_CMS={...}
```

#### Frontend (`apps/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CHAIN_ID=7082400
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
```

## Deployment

The project uses GitHub Actions for CI/CD:

1. **CI** (`ci.yml`): Runs on PRs - lint, typecheck, build
2. **Deploy** (`deploy.yml`): Deploys to GCP on push to main/develop

### Required Secrets
- `IDENTITY_PROVIDER` - GCP Workload Identity
- `SERVICE_ACCOUNT` - GCP Service Account
- `GCP_REGISTRY`, `GCP_REPO`, `REGION` - Artifact Registry
- `BACKEND_ENV_PROD/DEV`, `FRONTEND_ENV_PROD/DEV` - Environment files
- `SSH_PRIVATE_KEY_PROD/DEV`, `SSH_HOST_PROD/DEV`, `SSH_USER_PROD/DEV`

## Testing

```bash
# Run tests (when implemented)
yarn test

# Run tests for specific app
yarn workspace @coti-community/backend test
yarn workspace @coti-community/frontend test
```

## License

ISC
