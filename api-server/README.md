# Polkadot API Server

<img src="doc/IMG_POLKADOT_API_SERVER.png" alt="design"/>

The Polkadot API Server is a wrap-around of the [polkadot-js/api](https://polkadot.js.org/api/). This makes it easier to use the polkadot-js/api with any programming language in order to query data from Polkadot nodes. In addition to this, a number of custom defined calls were also implemented in the API Server. For example, one can query directly the amount of tokens a validator has been slashed at any block height.

The API Server was specifically built as a way for [PANIC](https://github.com/SimplyVC/panic_polkadot) to be able to retrieve data from the Polkadot nodes that it will monitor. As a result, not all functions from the polkadot-js/api were included in the API Server.

## Design and Features

If running from source
git pull
npm ci

# stop the older instance of the API Server
bash run_api.sh
If running as a Docker image
git pull
docker ps
docker stop <CONTAINER ID of the older release of the API Server>
docker build -t anishnath/polkadot_api_server .
docker run -p 3000:3000 \
-v <CONFIG_DIR>:/usr/src/app/config:ro \
-d anishnath/polkadot_api_server