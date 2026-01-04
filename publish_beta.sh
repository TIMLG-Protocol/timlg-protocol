#!/usr/bin/env bash
set -euo pipefail

BETA_APP_DIR="${BETA_APP_DIR:-$HOME/chronos_mvp/beta-app}"
SITE_DIR="${SITE_DIR:-$HOME/timlg-protocol}"
BASE_PATH="${BASE_PATH:-/beta/}"
DO_GIT_PUSH="${DO_GIT_PUSH:-0}"

echo "==> Build beta-app (base=${BASE_PATH})"
cd "$BETA_APP_DIR"
npm i
npm run build -- --base="${BASE_PATH}"

echo "==> Sync dist -> mkdocs docs/beta/"
rm -rf "$SITE_DIR/docs/beta"
mkdir -p "$SITE_DIR/docs/beta"
rsync -av --delete "$BETA_APP_DIR/dist/" "$SITE_DIR/docs/beta/"

echo "==> Done. Local test:"
echo "    cd $SITE_DIR && source ./.venv/bin/activate && mkdocs serve"
echo "    then open: http://127.0.0.1:8000/beta/"

if [[ "$DO_GIT_PUSH" == "1" ]]; then
  echo "==> Commit + push"
  cd "$SITE_DIR"
  git add docs/beta
  git commit -m "Beta: publish devnet faucet UI under /beta/" || true
  git push
  echo "==> Pushed. It will be available at /beta/ once your site deploy finishes."
fi
