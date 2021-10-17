## Quick Start

- Clone the repo: `https://github.com/anishnath/palkadot-scanner.git`

### Installation


``` bash  
services:  
  web:  
    container_name: web  
    deploy:  
      replicas: 1  
      restart_policy:  
        condition: any  
    expose:  
      - 3001  
    ports:  
      - 3001:3001  
    image: anishnath/palkadot-scan-web  
    links:  
      - api  
  api:  
    container_name: api  
    deploy:  
      replicas: 1  
      restart_policy:  
        condition: any  
    expose:  
      - 3000  
    ports:  
      - 3000:3000  
    image: anishnath/palkadot-scan-api  
version: '3'
```  

And

``` bash  
$ docker-compose up     
```  

### Basic usage  Web

``` bash  
$ cd web
$ yarn start
```  


Navigate to [http://localhost:3001](http://localhost:3001). The app will automatically reload if you change any of the source files.

#### Basic usage  API


```bash  
$ cd api-server/src 
$  node server.js  
```  

Navigate to [http://localhost:3000](http://localhost:3001) for the API server
