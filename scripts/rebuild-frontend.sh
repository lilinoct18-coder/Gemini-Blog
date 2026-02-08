#!/usr/bin/env bash
set -euo pipefail

# Trigger GitHub Actions workflow to rebuild the frontend image
# Requires: gh CLI authenticated

REPO="${GITHUB_REPO:-}"

if [ -z "$REPO" ]; then
  REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || true)
fi

if [ -z "$REPO" ]; then
  echo "Error: Could not detect repository. Set GITHUB_REPO=owner/repo or run from a git repo."
  exit 1
fi

echo "Repository: $REPO"
echo ""
echo "Triggering Frontend build..."
gh workflow run "build-frontend.yml" --repo "$REPO"
echo "  -> Triggered: Build Frontend"
echo ""
echo "Done! Check build status:"
echo "  gh run list --repo $REPO --limit 5"
