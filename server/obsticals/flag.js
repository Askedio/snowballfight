"use strict";

class Flag extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 52
    this.height = 52
    this.sprite = 'wings'
    this.type = 'flag'
    this.spawnTile = 'health'
    this.forTeam = null
    this.deleteOnImpact = true
    this.killBulletOnColission = true
    this.alwaysPlay = true
    this.resetIn = false
    this.respawn = false
    this.bulletKills = false
    this.blocking = false
    this.autospawn = true
    this.team = 'blue'

    this.tint = 0x0000ff


    this.changesSettings = (player) => {
      if (player.hasFlag == this.name || player.team != this.team) {
        return
      }
      player.hasFlag = this.name
      player.addSprite[this.name] = {
        sprite: this.sprite,
        scaleX: .05,
        scaleY: .05,
        anchorX: -.5,
        tint: 0x0000ff
          //  anchorY: 1
      }
    }



    this.sounds = {
      onCollide: {
        sound: 'chime1'
      }
    }

    this.body = {
      width: 200,
      height: 200,
      x: 50,
      y: 50
    }
  }



  onObsticalCollide(player) {
    if (player.team == this.forTeam) {
      super.onObsticalCollide(player)
    }
  }
}

module.exports = Flag