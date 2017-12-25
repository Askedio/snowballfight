"use strict";

class FlagCapPoint extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 52
    this.height = 52
    this.sprite = 'health'
    this.type = 'flagCapPoint'
    this.spawnTile = 'health'

    this.bulletKills = false
    this.blocking = false
    this.autospawn = true
    this.resetIn = false
    this.respawn = false
    this.deleteOnImpact = false
    this.killBulletOnColission = false

    this.changesSettings = (player) => {
      this.emit('flagCapture', player)
    }


    this.body = {
      width: 200,
      height: 200,
      x: 50,
      y: 50
    }
  }

  onObsticalCollide(player) {
    if (player.hasFlag && player.team == this.forTeam) {
      super.onObsticalCollide(player)
    }
  }
}

module.exports = FlagCapPoint