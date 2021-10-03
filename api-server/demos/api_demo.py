import requests

# defining the api-endpoint
API_ENDPOINT: str = "http://localhost:3000"
# API_ENDPOINT: str = "http://5.6.7.8:3000"

websocket: str = ' wss://rpc.polkadot.io'

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

print('/api/login')
payload='password=palkadot&username=palkadot'
headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
r = requests.request("POST", url, headers=headers, data=payload)
print(r.text)

print('/api/scan/chain?websocket=wss://rpc.polkadot.io&start_block=6908228&end_block=6908230')
url = "http://localhost:3000/api/scan/chain?websocket=wss://rpc.polkadot.io&start_block=6908228&end_block=6908230"

payload={}
headers = {}
r = requests.request("GET", url, headers=headers, data=payload)
print(r.text)