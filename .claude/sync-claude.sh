#!/usr/bin/env bash
# Bootstrap only: fetches/updates the MyClaude cache then delegates to its
# sync-claude.sh, which holds the actual sync logic. That means this file
# almost never needs editing — updating MyClaude's sync-claude.sh is enough
# to change behavior everywhere on next run. Run automatically by the
# SessionStart hook (see .claude/settings.json); safe to re-run manually.
set -euo pipefail

cache="$HOME/.claude-agents-shared"
repo_url="https://github.com/lchouville/MyClaude.git"
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -d "$cache/.git" ]; then
  git -C "$cache" fetch -q origin main
  if [ "$(git -C "$cache" rev-parse HEAD)" != "$(git -C "$cache" rev-parse origin/main)" ]; then
    git -C "$cache" merge -q --ff-only origin/main
  fi
else
  git clone -q "$repo_url" "$cache"
fi

exec bash "$cache/sync-claude.sh" "$dir"
