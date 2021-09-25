# Polkadot API Server

<img src="doc/IMG_POLKADOT_API_SERVER.png" alt="design"/>

The Polkadot API Server is a wrap-around of the [polkadot-js/api](https://polkadot.js.org/api/). This makes it easier to use the polkadot-js/api with any programming language in order to query data from Polkadot nodes. In addition to this, a number of custom defined calls were also implemented in the API Server. For example, one can query directly the amount of tokens a validator has been slashed at any block height.

The API Server was specifically built as a way for [PANIC](https://github.com/SimplyVC/panic_polkadot) to be able to retrieve data from the Polkadot nodes that it will monitor. As a result, not all functions from the polkadot-js/api were included in the API Server.

## Design and Features
