"use strict";
var weapons = require('../weapons').get()

class Devil extends require('./base') {
  constructor(name, state) {
    super(name)

    this.width = 64
    this.height = 64
    this.sprite = 'devil'
    this.type = 'weapon'
    this.weapon = 'devil'
    this.bulletKills = false
    this.blocking = false
    this.autospawn = true
    this.spawnTile = 'cannon'
    this.alwaysPlay = true
    this.resetIn = 5000
    this.deleteOnImpact = true
    this.killBulletOnColission = false

    this.respawn = () => {
      return setTimeout(() => {
        this.sendToRespawnState()
      }, require('../utils').getRandomInt(2 * 1000, 10 * 1000));
    }

    this.changesSettings = {
      weaponSettings: weapons.devil
    }

    this.body = {
      width: 320,
      height: 320,
      x: 155,
      y: 165
    }

    this.sounds = {
      onCollide: {
        sound: 'laugh1',
        pitch: 1
      }
    }
  }
}

module.exports = Devil