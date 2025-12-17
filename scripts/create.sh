#!/bin/bash

# Script to create a new blog post with title, description, and dates
# Usage: ./create.sh "Title of the Blog Post"

# Check if title argument is provided
if [ $# -eq 0 ]; then
    echo "📝 Usage: $0 \"Title of the Blog Post\""
    echo "Example: $0 \"My New Blog Post\""
    exit 1
fi

# Get the title from command line argument
TITLE="$1"

# Generate slug from title (replace spaces with hyphens and lowercase)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

# Get current date in the required format
CURRENT_DATE=$(date '+%b %d %Y')

# Generate filename with date prefix and title slug
FILENAME="src/content/blog/${SLUG}.md"

# Create the blog post template
cat > "$FILENAME" << EOF
---
title: '$TITLE'
description: 'Description of the blog post - $TITLE'
pubDate: '$CURRENT_DATE'
updatedDate: '$CURRENT_DATE'  # Optional
---

## Introduction

TODO: Write your introduction here.

## Main Content

TODO: Write your main content here.

## Conclusion

TODO: Write your conclusion here.

EOF

echo "📄 Blog post created successfully: $FILENAME"
echo "✏️  You can now edit the file with your content."
echo "📅 Published date: $CURRENT_DATE"