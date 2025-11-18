#!/bin/bash
set -e

PACKAGE_VERSION=$(jq -r .version package.json)
MAJOR_VERSION=$(echo "$PACKAGE_VERSION" | cut -d'.' -f1)

# Extract minimum Node version from package.json engines.node field
# Format: ">=18.0" -> extract "18"
ENGINE_NODE=$(jq -r '.engines.node // ""' package.json)
if [[ "$ENGINE_NODE" =~ \>=([0-9]+) ]]; then
  DEFAULT_NODE_VERSION="${BASH_REMATCH[1]}.x"
else
  # Fallback to latest LTS if engines.node is not specified
  DEFAULT_NODE_VERSION="22.x"
fi

case "$MAJOR_VERSION" in
  0)
    # Legacy version - used Node 12
    NODE_VERSION="12.x"
    ;;
  1)
    # Version 1 used Node 18
    NODE_VERSION="18.x"
    ;;
  *)
    # For version 2+, use the minimum Node version from package.json engines
    NODE_VERSION="$DEFAULT_NODE_VERSION"
    ;;
esac

echo "✅ Detected Node.js version: $NODE_VERSION (package v$PACKAGE_VERSION)"
echo "node_version=$NODE_VERSION" >> "$GITHUB_ENV"
