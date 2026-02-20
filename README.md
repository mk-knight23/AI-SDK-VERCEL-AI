# InsightStream

A Next.js 15 React Server Components application with Vercel AI SDK integration.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React Server Components
- **AI:** Vercel AI SDK
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file:

```env
# OpenAI API Key (for AI features)
OPENAI_API_KEY=your_api_key_here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Endpoints

### Health Check

```
GET /api/health
```

Returns service health status.

## Deployment

### Vercel (Recommended)

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Deploy to production
vercel --prod
```

#### Option 2: Git Integration
1. Push code to GitHub
2. Connect repository at [vercel.com](https://vercel.com)
3. Configure environment variables (`OPENAI_API_KEY`)
4. Deploy automatically on push

#### Option 3: GitHub Actions
Set these secrets in GitHub (Settings > Secrets):
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

### Docker

```bash
# Build image
docker build -t insight-stream .

# Run container
docker run -p 3000:3000 insight-stream
```

## Project Structure

```
app/
├── api/
│   └── health/
│       └── route.ts      # Health check endpoint
├── globals.css           # Global styles
├── layout.tsx            # Root layout
└── page.tsx              # Home page

lib/
└── utils.ts              # Utility functions

components.json           # shadcn/ui config
next.config.ts            # Next.js configuration
tailwind.config.ts        # Tailwind CSS configuration
```

## License

MIT
