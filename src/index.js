import Server from './config/Server'

const objServer = new Server()
objServer.start()

export default {
  app: objServer.app,
  server: objServer.server,
}