"use strict";

class Speed extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 52
    this.height = 52
    this.sprite = 'wings'
    this.type = 'speed'
    this.spawnTile = 'health'
    this.bulletKills = true
    this.blocking = false
    this.autospawn = true
    this.deleteOnImpact = true
    this.killBulletOnColission = true
    this.resetIn = 3000


    this.sounds = {
      onCollide: {
        sound: 'chime1'
      }
    }

    this.changesSettings = {
      maxSpeed: 360,
      minSpeed: 330
    }


    this.body = {
      width: 320,
      height: 320,
      x: 155,
      y: 165
    }
  }
}

module.exports = Speed