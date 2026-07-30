#!/usr/bin/env bash
#
# lint-gate.sh — pre-push quality gate.
#
# Wired as a git pre-push hook via `core.hooksPath=.githooks`. Any stage failing aborts the push.
#
# Four stages, each of which has caught something real on this project:
#
#   oxlint   — correctness lint. Caught 88 no-useless-escape errors that turned out to be a live
#              bug: `\:` inside a JSX template literal collapses to `:`, so a block of hand-written
#              dark-mode CSS was emitting selectors that matched nothing (see adr/0002).
#   biome    — formatting. Keeps diffs about content rather than whitespace.
#   tsc      — typecheck. The build script runs it too; running it here means a broken type never
#              reaches CI in the first place.
#   trivy    — dependency, secret and licence scan (adr/0001). Blocks HIGH/CRITICAL.
#
# This started as a general-purpose template carrying nine stages — ruff, bandit, semgrep,
# dependency-cruiser, sigma-cli, an audit-report redaction pass. Six of them could never fire on a
# React site and printed a "skip" line every push. A gate whose output is mostly noise trains you
# to stop reading it, which is the one failure mode a pre-push gate cannot survive. They are gone;
# `git log` has them if this ever becomes a Python project.
#
# Behavioural verification is deliberately NOT here: `npm run verify` drives a real browser and
# takes about a minute, which is too slow for every push. It runs against production after each
# deploy instead (see adr/0006).

set -uo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 1
fail=0
step() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }

# 1. Oxlint — fast correctness lint (~12x ESLint). Uses the pinned local devDep.
step "oxlint"
npx --no-install oxlint --config .oxlintrc.json src tests || fail=1

# 2. Format check — Biome.
step "biome format --check"
npx --no-install @biomejs/biome format --error-on-warnings . || fail=1

# 3. Typecheck.
step "tsc --noEmit"
npx --no-install tsc --noEmit || fail=1

# 4. Dependency / secret / licence scan (adr/0001). Self-skips if trivy is not installed, since
#    it is a system tool rather than a devDependency — the same scan runs in CI regardless.
if command -v trivy >/dev/null 2>&1; then
  step "trivy fs (vuln, secret, licence)"
  trivy fs --scanners vuln,secret,license --exit-code 1 --severity HIGH,CRITICAL --quiet . || fail=1
else
  printf '\n· skip trivy (not installed locally — CI still runs it)\n'
fi

if [ "$fail" -eq 0 ]; then
  printf '\n✅ lint-gate passed\n'
else
  printf '\n❌ lint-gate failed — push aborted\n'
fi
exit "$fail"
