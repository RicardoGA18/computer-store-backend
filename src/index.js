import Server from './config/Server'

const objServer = new Server()
objServer.start()

export const app = objServer.app
export const server = objServer.server