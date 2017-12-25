"use strict";

class Sign extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 100
    this.height = 100
      //  rotation = 6 // 6 on left side
    this.sprite = 'winterobjects'
    this.frame = 3
    this.type = 'sign'
    this.spawnTile = 'blocksign'
    this.blocking = false
    this.health = 1
    this.destroyable = true
    this.disablePlayBulletKillSound = true
    this.autospawn = true
    this.spawnLayer = 'blocksign'
    this.killBulletOnColission = true
    this.bringToTop = require('../utils').getRandomInt(0, 1)
    this.playInView = true

    this.respawn = () => {
      return setTimeout(() => {
        this.health = 1
        this.sendToRespawnState()
      }, require('../utils').getRandomInt(2 * 1000, 10 * 1000));
    }


    this.sounds = {
      onKill: {
        sound: 'smash4',
      }
    }

    this.body = {
      width: 50,
      height: 50,
      x: 40,
      y: 33
    }

    if (this.frame == 9) {
      this.body = {
        width: 50,
        height: 50,
        x: 40,
        y: 63
      }
    }
  }
}

module.exports = Sign