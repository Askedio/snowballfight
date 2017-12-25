"use strict";

class Rooms {
  constructor() {
    this.limit = 10
    this.globalClients = 0
    this.list = {}
    this.watch()
  }

  watch() {
    setInterval(() => {
      this.globalClients = 0
      for (var room in this.list) {
        var clients = require('./socket').io.sockets.adapter.rooms[room];

        if (!clients || !clients.length) {
          this.destroy(room)
          continue
        }
        this.globalClients += clients.length
      }

      console.log('                             '.bgBlack)
      console.log('Total Connections:'.blue, this.globalClients)
      console.log('Total Rooms:'.blue, Object.keys(this.list).length)
    }, 10000)
  }

  totalClients() {
    return this.globalClients
  }

  total() {
    return Object.keys(this.list).length
  }

  join(player, room) {
    var _room = this.get(room)
    if (!_room) {
      _room = this.create(room)
    } else {
      if (_room.length() >= this.limit) {
        _room = this.create(room + (require('sillyname')()).toLowerCase().replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "-").substring(0, 18))
      }
    }
    player.init(_room)
    _room.join(player)
  }

  destroy(room) {
    if (!this.list[room]) {
      return
    }

    this.list[room].state.destroy()
    delete this.list[room]
  }

  leave(player) {
    var _room = this.get(player.room)
    if (!_room) {
      return
    }

    _room.leave(player)

    if (player.robot) {
      _room.state.bots--
    }

    if (!_room.length()) {
      this.destroy(_room)
    }
  }

  create(room) {
    return this.list[room] = new(require('./room'))(room)
  }

  get(room) {
    return this.list[room]
  }
}

module.exports = new Rooms()