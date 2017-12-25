"use strict";

class Snowman extends require('./base') {
  constructor(name, state) {
    super(name)


    this.width = 80
    this.height = 90
    this.sprite = 'snowman'
    this.type = 'snowman'
    this.spawnTile = 'trees'
    this.bulletKills = false
    this.blocking = true
    this.autospawn = true
    this.destroyable = true
    this.disablePlayBulletKillSound = true
    this.playInView = true
    this.stopsPlayer = true

    this.respawn = () => {
      return setTimeout(() => {
        this.health = 5
        this.sendToRespawnState()
      }, require('../utils').getRandomInt(2 * 1000, 10 * 1000));
    }

    this.sounds = {
      onKill: {
        sound: 'smash3',
      }
    }

    this.killBulletOnColission = true
    this.bringToTop = true
    this.killReward = require('../utils').getRandomInt(100, 200)
    this.health = 5

    this.body = {
      width: 80,
      height: 80,
      x: 54,
      y: 100
    }
  }
}

module.exports = Snowman