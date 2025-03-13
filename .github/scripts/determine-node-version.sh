#!/bin/bash
set -e

PACKAGE_VERSION=$(jq -r .version package.json)
MAJOR_VERSION=$(echo "$PACKAGE_VERSION" | cut -d'.' -f1)

case "$MAJOR_VERSION" in
  0)
    NODE_VERSION="12.x"
    ;;
  1)
    NODE_VERSION="18.x"
    ;;
  2)
    NODE_VERSION="22.x"
    ;;
  *)
    echo "❌ Unsupported package version: $PACKAGE_VERSION"
    exit 1
    ;;
esac

echo "✅ Detected Node.js version: $NODE_VERSION"
echo "node_version=$NODE_VERSION" >> "$GITHUB_ENV"
