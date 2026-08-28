#!/bin/sh
export UUID="${UUID:-8d6b237f-366f-439a-bbf2-a1fa1c0a6c11}"
export PROROCOL="${PROROCOL:-vmess}"
export VMESS_PORT="${VMESS_PORT:-8080}"
export WSPATH="${WSPATH:-/ws}"
export TYPE="${TYPE:-ws}"
exec node index.js
