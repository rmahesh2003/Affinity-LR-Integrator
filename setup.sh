#!/bin/bash

# Create necessary directories
mkdir -p src/main/db
mkdir -p src/renderer/components
mkdir -p public

# Install dependencies
npm install

# Create .gitignore
cat > .gitignore << EOL
# Dependencies
node_modules/

# Production
build/
dist/

# Development
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea/
.vscode/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOL

# Make setup script executable
chmod +x setup.sh

echo "Setup complete! You can now run 'npm run dev' to start the development server." 