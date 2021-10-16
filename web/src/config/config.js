const dev = {
  apiGateway: {
    URL: 'http://localhost:3000',
  },
}
const docker_compose = {
  apiGateway: {
    URL: 'http://api:3000',
  },
}

console.log(process.env.REACT_APP_STAGE)
const config = process.env.REACT_APP_STAGE === 'docker-compose' ? docker_compose : dev

export default {
  ...config,
}
