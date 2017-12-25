"use strict";

class Room {
  constructor(name) {
    this.name = name
    this.state = new(require('./state'))(name)
  }

  length() {
    return Object.keys(this.state.players).length
  }

  join(player) {
    this.state.players[player.uid] = player
    this.state.connected[player.uid] = player
    player.reset()
  }

  leave(player) {
    delete this.state.players[player.uid]
    delete this.state.connected[player.uid]
    this.state.removeUsers.push(player.uid)
  }
}

module.exports = Room