const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const ConfigParser = require('configparser')
const { ApiPromise, WsProvider } = require('@polkadot/api')
const bodyParser = require('body-parser')

const substrateRPC = require('./interface/substrate_rpc')
const timeoutUtils = require('./utils/timeout')

const TIMEOUT_TIME_MS = 10000
const REQUEST_SUCCESS_STATUS = 200
const REQUEST_ERROR_STATUS = 400

function errorNeedToSetUpAPIMsg(websocket) {
  return { error: `An API for ${websocket} ` + 'needs to be setup before it can be queried' }
}

async function startListen(websocket) {
  try {
    console.log(`Connecting to ${websocket}`)
    // connect to the WebSocket once and reuse that connection
    let provider = new WsProvider(websocket)
    // open an API connection with the provider
    let api = await timeoutUtils.callFnWithTimeoutSafely(
      ApiPromise.create,
      [{ provider }],
      TIMEOUT_TIME_MS,
      'Connection could not be established.',
    )
    return { api: api, provider: provider }
  } catch (e) {
    console.log(e.toString())
  }
}

async function startPolkadotAPI() {
  // Start up the API
  const app = express()
  //await app.use(cors(express.json()))
  await app.use(cors({ origin: '*' }))
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  //await app.use(express.json())

  // declare a dictionary which will contain all the apis and providers that
  // correspond to the IPs submitted by the user in the format
  // websocket_ip -> { api, provider }
  let apiProviderDict = {}

  // Read the configuration file (user_config_main.ini)
  // create a ConfigParser object which can read the config file
  const user_config_main = new ConfigParser()
  // specify the config file from which to read the configuration
  user_config_main.read('../config/user_config_main.ini')

  // read which API Port to use from the main config
  const API_PORT = await user_config_main.get('api_server', 'port')

  // Read the configuration file (user_config_nodes.ini)
  // create a ConfigParser object which can read the config file
  const user_config_nodes = new ConfigParser()
  // specify the config file from which to read the configuration
  user_config_nodes.read('../config/user_config_nodes.ini')

  // iterate over every node defined in the nodes config
  for (let i = 0; i < user_config_nodes.sections().length; i++) {
    // read the node's websocket from the config file
    const websocket = user_config_nodes.get(user_config_nodes.sections()[i], 'ws_url')

    // check whether an api has already been connected for that websocket_ip
    if (websocket in apiProviderDict) {
      console.log(`An API for ${websocket} has already been set up`)
    } else {
      // add the api and provider to the dictionary apiProviderDict so
      // that it can be accessed using its websocket ip as its key
      apiProviderDict[websocket] = await startListen(websocket)
      // check if an API connection was successfully established
      if (apiProviderDict.hasOwnProperty(websocket) && apiProviderDict[websocket]) {
        console.log(`Successfully Connected to ${websocket}`)
      }
    }
  }

  await app.listen(API_PORT)
  console.log(`API running on port ${API_PORT}`)

  // Miscellaneous Endpoints
  app.get('/api/pingApi', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      return res.status(REQUEST_SUCCESS_STATUS).send({ result: 'pong' })
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  app.post('/api/login', async (req, res) => {
    console.log('Received request for %s', req.url)
    if ( typeof req.body.username !== 'undefined' && req.body.username ){
      const username = req.body.username
      if ('palkadot' !== username) {
        return res.status(REQUEST_ERROR_STATUS).send({ error: 'Invalid Username' })
      }
    }else {
      return res.status(REQUEST_ERROR_STATUS).send({ error: 'Invalid Username' })
    }

    if ( typeof req.body.password === 'undefined'){
      return res.status(REQUEST_ERROR_STATUS).send({ error: 'Invalid Password' })
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      '$2a$10$uahLxzA/XjHnhPRSrOAYx.1WAhCDLYoDnLJ8hG2kjxLTZFqT4yQAW',
    )
    if (!validPassword) return res.status(REQUEST_ERROR_STATUS).send({ error: 'Invalid Password' })
    res.send('OK')
  })

  app.get('/api/pingNode', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(apiProviderDict[websocket].api, 'system/chain')
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send({ result: 'pong' })
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'API call pingNode failed.' })
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  app.get('/api/getConnectionsList', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      let websocket_api_list = []
      // iterate over each key in the map of websocket_ip ->
      // {api, provider}
      for (let websocket_ip in apiProviderDict) {
        // check if API is defined (so it is not returned in the list
        // if a connection was never established)
        if (apiProviderDict.hasOwnProperty(websocket_ip) && apiProviderDict[websocket_ip]) {
          // add the ip to the list of ips
          websocket_api_list.push(websocket_ip)
        }
      }
      return res.status(REQUEST_SUCCESS_STATUS).send({ result: websocket_api_list })
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  // RPC API Endpoints
  // Chain
  app.get('/api/scan/chain', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      let return_list = []
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // extract the start blockNumber passed in the query
      const startblock = req.query.start_block
      // extract the end blockNumber passed in the query
      const endblock = req.query.end_block

      for (let i = startblock; i <= endblock; i++) {
        // check whether an api has been connected for that websocket
        if (websocket in apiProviderDict) {
          const apiResult = await substrateRPC.rpcAPI(
            apiProviderDict[websocket].api,
            'chain/getBlockHash',
            i,
          )
          if ('result' in apiResult) {
            const blockHashResult = await substrateRPC.rpcAPI(
              apiProviderDict[websocket].api,
              'chain/getHeader',
              apiResult.result,
            )
            if ('result' in blockHashResult) {
              return_list.push(blockHashResult)
            } else {
              if (apiProviderDict[websocket].provider.isConnected) {
                return_list.push(blockHashResult)
              } else {
                return res
                  .status(REQUEST_ERROR_STATUS)
                  .send({ error: 'Lost connection with node.' })
              }
            }
          } else {
            if (!apiProviderDict[websocket].provider.isConnected) {
              startListen(websocket)
              return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node. Reconnecting' })
            }
          }
        } else {
          return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
        }
      }
      return res.status(REQUEST_SUCCESS_STATUS).send({ result: return_list })
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  // RPC API Endpoints
  // Chain
  app.get('/api/rpc/chain/getBlockHash', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // extract the blockNumber passed in the query (optional)
      const blockNumber = req.query.block_number
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(
          apiProviderDict[websocket].api,
          'chain/getBlockHash',
          blockNumber,
        )
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send(apiResult)
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send(apiResult)
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  app.get('/api/rpc/chain/getFinalizedHead', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(
          apiProviderDict[websocket].api,
          'chain/getFinalizedHead',
        )
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send(apiResult)
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send(apiResult)
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  app.get('/api/rpc/chain/getHeader', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // extract the hash passed in the query (optional)
      const hash = req.query.hash
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(
          apiProviderDict[websocket].api,
          'chain/getHeader',
          hash,
        )
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send(apiResult)
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send(apiResult)
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })


  // System
  app.get('/api/rpc/system/chain', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(apiProviderDict[websocket].api, 'system/chain')
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send(apiResult)
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send(apiResult)
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })

  app.get('/api/rpc/system/health', async function (req, res) {
    console.log('Received request for %s', req.url)
    try {
      // extract the web socket passed in the query
      const websocket = req.query.websocket
      // check whether an api has been connected for that websocket
      if (websocket in apiProviderDict) {
        const apiResult = await substrateRPC.rpcAPI(apiProviderDict[websocket].api, 'system/health')
        if ('result' in apiResult) {
          return res.status(REQUEST_SUCCESS_STATUS).send(apiResult)
        } else {
          if (apiProviderDict[websocket].provider.isConnected) {
            return res.status(REQUEST_ERROR_STATUS).send(apiResult)
          } else {
            return res.status(REQUEST_ERROR_STATUS).send({ error: 'Lost connection with node.' })
          }
        }
      } else {
        return res.status(REQUEST_ERROR_STATUS).send(errorNeedToSetUpAPIMsg(websocket))
      }
    } catch (e) {
      return res.status(REQUEST_ERROR_STATUS).send({ error: e.toString() })
    }
  })
}

startPolkadotAPI()
