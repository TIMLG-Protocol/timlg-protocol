#!/usr/bin/env bash
set -euo pipefail

CHRONOS_REPO="${CHRONOS_REPO:-$HOME/chronos_mvp}"
BETA_APP_DIR="$CHRONOS_REPO/beta-app"
DEST_DIR="docs/assets/beta"
BRANCH="${BRANCH:-main}"
COMMIT_MSG=""

while getopts ":m:" opt; do
  case "$opt" in
    m) COMMIT_MSG="$OPTARG" ;;
    *) echo "Usage: $0 -m \"commit message\""; exit 1 ;;
  esac
done

if [[ -z "$COMMIT_MSG" ]]; then
  echo "ERROR: missing -m \"commit message\""
  exit 1
fi

if [[ ! -d "$BETA_APP_DIR" ]]; then
  echo "ERROR: beta-app not found at: $BETA_APP_DIR"
  exit 1
fi

if [[ ! -d ".git" ]]; then
  echo "ERROR: run this from timlg-protocol repo root (where .git exists)."
  exit 1
fi

echo "==> Build beta-app…"
pushd "$BETA_APP_DIR" >/dev/null
npm run build
popd >/dev/null

# Detect Vite outDir
OUTDIR=""
if [[ -d "$BETA_APP_DIR/dist-embed" ]]; then
  OUTDIR="$BETA_APP_DIR/dist-embed"
elif [[ -d "$BETA_APP_DIR/dist" ]]; then
  OUTDIR="$BETA_APP_DIR/dist"
else
  echo "ERROR: no dist-embed/ or dist/ found in $BETA_APP_DIR"
  exit 1
fi

echo "==> Using output dir: $OUTDIR"

echo "==> Copy to $DEST_DIR…"
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"
cp -R "$OUTDIR/"* "$DEST_DIR/"

INDEX_HTML="$DEST_DIR/index.html"
ASSETS_DIR="$DEST_DIR/assets"

if [[ ! -f "$INDEX_HTML" ]]; then
  echo "ERROR: index.html not found at $INDEX_HTML"
  exit 1
fi
if [[ ! -d "$ASSETS_DIR" ]]; then
  echo "ERROR: assets dir not found at $ASSETS_DIR"
  exit 1
fi

JS_BASENAME="$(ls "$ASSETS_DIR"/index-*.js 2>/dev/null | head -n1 | xargs -n1 basename || true)"
CSS_BASENAME="$(ls "$ASSETS_DIR"/index-*.css 2>/dev/null | head -n1 | xargs -n1 basename || true)"

if [[ -z "$JS_BASENAME" || -z "$CSS_BASENAME" ]]; then
  echo "ERROR: could not find index-*.js or index-*.css in $ASSETS_DIR"
  ls -la "$ASSETS_DIR" || true
  exit 1
fi

echo "==> Patch index.html to use RELATIVE ./assets/ (robust for mkdocs / subpaths)…"

# 1) Force any asset path prefix to ./assets/ (covers script, css, modulepreload)
#    Matches: "assets/..", "./assets/..", "/assets/..", "/beta/assets/.."
perl -0777 -i -pe '
  s|(\b(?:src|href)=\")/beta/assets/|$1./assets/|g;
  s|(\b(?:src|href)=\")/assets/|$1./assets/|g;
  s|(\b(?:src|href)=\")assets/|$1./assets/|g;
  s|(\b(?:src|href)=\")\./assets/|$1./assets/|g;
' "$INDEX_HTML"

# 2) Now ensure the main index hashes match what exists (covers any leftover)
perl -0777 -i -pe '
  s|(\b(?:src|href)=\"\./assets/)index-[^"]+\.js\"|$1'"$JS_BASENAME"'\"|g;
  s|(\b(?:src|href)=\"\./assets/)index-[^"]+\.css\"|$1'"$CSS_BASENAME"'\"|g;
' "$INDEX_HTML"

echo "==> Verify index.html references:"
grep -nE 'src="|href="' "$INDEX_HTML" | grep -E '\./assets/' || true

echo "==> Verify referenced files exist:"
grep -oE '\./assets/[^"]+' "$INDEX_HTML" | sed 's|^\./||' | while read -r rel; do
  if [[ ! -f "$DEST_DIR/$rel" ]]; then
    echo "ERROR: Missing file referenced by index.html: $DEST_DIR/$rel"
    exit 1
  fi
done

echo "==> Git add/commit/push…"
git add "$DEST_DIR"
git commit -m "$COMMIT_MSG"
git push origin "$BRANCH"

echo "✅ Done."
