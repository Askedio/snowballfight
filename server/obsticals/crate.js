"use strict";

class Crate extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 73
    this.height = 85
    this.rotation = 6 // 6 on left side
    this.sprite = 'winterobjects'
    this.frame = 2
    this.type = 'crate'
    this.blocking = true
    this.health = 3
    this.destroyable = true
    this.disablePlayBulletKillSound = true
    this.autospawn = true
    this.killBulletOnColission = true
    this.playInView = true
    this.stopsPlayer = true
    this.body = {
      width: 50,
      height: 50,
      x: 20,
      y: 0
    }

    this.respawn = () => {
      return setTimeout(() => {
        this.health = require('../utils').getRandomInt(2, 5)
        this.sendToRespawnState()
      }, require('../utils').getRandomInt(2 * 1000, 10 * 1000));
    }

    this.sounds = {
      onKill: {
        sound: 'explosion',
      }
    }
  }
}

module.exports = Crate