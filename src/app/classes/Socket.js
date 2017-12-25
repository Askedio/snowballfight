import State from './State'

const SOCKET_URL = '127.0.0.1:8099'

import {
  getParameterByName
} from '../utils'

export default class {

  constructor(app) {
    this.app = app
    this.connected = false
    this.uid = null
  }

  setIo() {
    var config = {
      query: 'room=' + (getParameterByName('join') || 'default'),
      transports: ['websocket']
    }

    if (process.env.NODE_ENV == 'production') {
      this.io = require('socket.io-client')(config)
      return
    }

    this.io = require('socket.io-client')(SOCKET_URL, config)
  }

  connect() {
    this.setIo()
    this.listen()

    return this.io
  }

  listen() {
    this.io.on('connected', (data) => {
      this.onConnected(data)
    })
  }

  onConnected(data) {
    this.connected = true;
    this.uid = data.uid;

    if (this.app.state) {
      this.app.state.reset()
      this.app.state = null
    }


    this.app.state = new State(this.app)
    this.app.state.setup(data)
    this.app.defaultPlayerData = data.player
  }

  on(what, then) {
    return this.io.on(what, then)
  }

  emit(what, then) {
    return this.io.emit(what, then)
  }
}