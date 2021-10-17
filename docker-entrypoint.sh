#!/bin/bash
set -eou pipefail
cd web
exec yarn start &
cd api-server
cd src
exec node server.js