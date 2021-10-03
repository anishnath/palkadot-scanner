import requests

# defining the api-endpoint
API_ENDPOINT: str = "http://localhost:3000"
# API_ENDPOINT: str = "http://5.6.7.8:3000"

websocket: str = 'ws://1.2.3.4:9944'

# Miscellaneous Endpoints
print('Miscellaneous Endpoints:')

print('/api/pingApi')
r = requests.get(url=API_ENDPOINT + '/api/pingApi')
print(r.text)

print('/api/pingNode')
r = requests.get(url=API_ENDPOINT + '/api/pingNode',
                 params={'websocket': websocket})
print(r.text)

print('/api/getConnectionsList')
r = requests.get(url=API_ENDPOINT + '/api/getConnectionsList')
print(r.text)

print()

# RPC API
# Chain
print('Chain:')

print('/api/rpc/chain/getBlockHash')
r = requests.get(url=API_ENDPOINT + '/api/rpc/chain/getBlockHash',
                 params={'websocket': websocket})
print(r.text)
r = requests.get(url=API_ENDPOINT + '/api/rpc/chain/getBlockHash',
                 params={'websocket': websocket,
                         'block_number': '36430'})
print(r.text)