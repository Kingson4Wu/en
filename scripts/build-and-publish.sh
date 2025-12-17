#!/bin/bash

# Script to build and deploy the Astro site
echo "🔨 Building the site..."

# Build the site
if npm run build; then
    echo "✅ Build completed successfully!"
    echo "📤 Deploying to GitHub Pages..."
    
    # Deploy the site
    if npm run deploy; then
        echo "🎉 Deployment completed successfully!"
        echo "Your site should be live at https://kingson4wu.github.io/en/"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi