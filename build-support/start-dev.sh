source .env
source build-support/env-dev
./build-support/stop-dev-database.sh
./build-support/start-dev-database.sh
babel-watch src/server.js
