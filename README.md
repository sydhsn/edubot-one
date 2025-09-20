Step 1: Create the Nx Monorepo with an Integrated Setup
bash
# Create the project root directory and initialize Git
mkdir edubot-one
cd edubot-one
git init

# Initialize the Nx workspace with an integrated repo structure.
# This is the modern, recommended setup for full-stack apps.
npx create-nx-workspace@latest . \
  --preset=ts \
  --packageManager=npm \
  --appName=edubot-one \
  --style=css \
  --nxCloud=false

# Add essential plugins for Next.js, NestJS, and React
npm install --save-dev @nx/next @nx/nest @nx/react
Step 2: Generate the Applications and Shared Libraries
1. Generate the Next.js 14 Frontend (apps/web):

bash
nx generate @nx/next:application web \
  --style=css \
  --appDir=true \        # Use the new App Router
  --src=true \           # Use a /src directory
  --serverSideExecution=false
2. Generate the NestJS Backend (apps/api):

bash
nx generate @nx/nest:application api \
  --frontendProject=web  # Sets up a dev-time proxy from web to api
3. Generate the Shared Libraries (in packages/):

We'll use the --publishable and --buildable flags to make them independent, importable packages.

bash
# Shared UI component library (React)
nx generate @nx/react:library ui \
  --style=css \
  --publishable \
  --importPath=@edubot-one/ui \
  --buildable

# Shared TypeScript types/interfaces
nx generate @nx/js:library types \
  --publishable \
  --importPath=@edubot-one/types \
  --buildable

# Shared utilities (formatting, validations, etc.)
nx generate @nx/js:library utils \
  --publishable \
  --importPath=@edubot-one/utils \
  --buildable

# Shared configuration (not a typical lib, but we can manage it here)
# We'll handle configs in the root, but this lib can hold config logic if needed.
nx generate @nx/js:library config \
  --publishable \
  --importPath=@edubot-one/config \
  --buildable
Step 3: Final Project Structure
Your final structure will now match your vision, powered by Nx:

text
edubot-one/
├── apps/
│   ├── web/                 # Next.js 14 (App Router)
│   │   ├── src/
│   │   │   ├── app/         # (pages/, layouts/, etc.)
│   │   │   ├── components/  # App-specific components
│   │   │   └── lib/         # App-specific hooks, API clients
│   │   ├── next.config.js
│   │   ├── project.json     # Nx project config
│   │   └── package.json
│   │
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── modules/     # Feature modules (auth, ai, etc.)
│       │   ├── main.ts
│       │   └── app.module.ts
│       ├── project.json
│       ├── package.json
│       └── nest-cli.json
│
├── packages/                # SHARED LIBRARIES
│   ├── ui/                  # Reusable React components
│   │   ├── src/
│   │   ├── package.json     # name: "@edubot-one/ui"
│   │   └── project.json
│   │
│   ├── types/               # Shared TypeScript interfaces
│   │   ├── src/
│   │   ├── package.json     # name: "@edubot-one/types"
│   │   └── project.json
│   │
│   ├── utils/               # Shared utility functions
│   │   ├── src/
│   │   ├── package.json     # name: "@edubot-one/utils"
│   │   └── project.json
│   │
│   └── config/              # Shared configuration (optional)
│       ├── src/
│       ├── package.json     # name: "@edubot-one/config"
│       └── project.json
│
├── tools/                   # Custom generators/scripts
├── .github/workflows/       # CI/CD pipelines (you can add this)
├── nx.json                  # Nx workspace configuration
├── package.json             # Root package.json with workspaces
├── tsconfig.base.json       # Base TypeScript config
└── README.md
Step 4: Configure Import Paths (Critical Step)
Nx automatically configures path mapping in the root tsconfig.base.json for you. This is what allows you to import from @edubot-one/ui or @edubot-one/types anywhere in the monorepo.

Your tsconfig.base.json will look something like this automatically:

json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@edubot-one/ui": ["packages/ui/src/index.ts"],
      "@edubot-one/types": ["packages/types/src/index.ts"],
      "@edubot-one/utils": ["packages/utils/src/index.ts"],
      "@edubot-one/config": ["packages/config/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
Step 5: Install Dependencies & Test the Build
1. Install any top-level dependencies you know you'll need:

bash
# Example: Install React Query for data fetching in the frontend
npm install @tanstack/react-query
2. Do a test build to ensure everything is wired correctly:

bash
# Build all projects and their dependencies
nx run-many --target=build --all

# Or build a specific project
nx build api
nx build web
nx build ui
3. Start the development environment:

bash
# Start the frontend and backend in dev mode
nx dev api
nx dev web

# Or use run-many to start both (if configured in nx.json)
nx run-many --target=dev --projects=api,web
Step 6: Initial Commit
bash
git add .
git commit -m "chore: initialize Nx monorepo with apps/web (Next.js), apps/api (NestJS), and shared libraries (ui, types, utils, config)"
This structure gives you a professional, enterprise-grade foundation for building and scaling Edubot One. You can now start developing your features within this organized framework.