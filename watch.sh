#!/bin/bash

# Watch for changes in api/ directory and rebuild on changes
echo "👀 Watching api/ directory for changes..."
echo "Press Ctrl+C to stop"

LAST_CHANGE=0

while true; do
  # Get the latest modification time of .go files
  CURRENT=$(find api -name "*.go" -type f -exec stat -f "%m" {} \; 2>/dev/null | sort -nr | head -1)

  if [ "$CURRENT" != "$LAST_CHANGE" ] && [ ! -z "$CURRENT" ]; then
    if [ "$LAST_CHANGE" != "0" ]; then
      echo ""
      echo "🔄 Changes detected! Rebuilding..."
      docker compose build nakama
      echo "♻️  Restarting Nakama..."
      docker compose restart nakama
      echo "✅ Ready!"
    fi
    LAST_CHANGE=$CURRENT
  fi

  sleep 2
done
