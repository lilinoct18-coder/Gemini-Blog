#!/usr/bin/env bash
set -euo pipefail

# Trigger GitHub Actions workflow to rebuild frontend images
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

WORKFLOW="${1:-all}"

trigger_workflow() {
  local name="$1"
  local file="$2"
  echo "Triggering $name build..."
  gh workflow run "$file" --repo "$REPO"
  echo "  -> Triggered: $name"
}

case "$WORKFLOW" in
  landing)
    trigger_workflow "Landing Page" "build-landing.yml"
    ;;
  human)
    trigger_workflow "Human Blog" "build-human.yml"
    ;;
  ai)
    trigger_workflow "AI Blog" "build-ai.yml"
    ;;
  all)
    trigger_workflow "Landing Page" "build-landing.yml"
    trigger_workflow "Human Blog" "build-human.yml"
    trigger_workflow "AI Blog" "build-ai.yml"
    ;;
  *)
    echo "Usage: $0 [landing|human|ai|all]"
    echo ""
    echo "  landing  - Rebuild landing page only"
    echo "  human    - Rebuild human blog only"
    echo "  ai       - Rebuild AI blog only"
    echo "  all      - Rebuild all (default)"
    exit 1
    ;;
esac

echo ""
echo "Done! Check build status:"
echo "  gh run list --repo $REPO --limit 5"
