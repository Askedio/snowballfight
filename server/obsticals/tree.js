"use strict";

class Tree extends require('./base') {
  constructor(name, state) {
    super(name)

    this.playInView = true
    this.width = 64
    this.height = 96
    this.sprite = 'tree'
    this.type = 'tree'
    this.spawnTile = 'trees'
    this.bulletKills = true
    this.blocking = true
    this.autospawn = true
    this.destroyable = true
    this.disablePlayBulletKillSound = true
    this.health = require('../utils').getRandomInt(1, 2)
    this.explosionType = 'grey'
    this.killBulletOnColission = true
    this.bringToTop = true

    this.sounds = {
      onKill: {
        sound: 'smash2'
      }
    }

    this.body = {
      width: 64,
      height: 68,
      x: 28,
      y: 120
    }
  }
}

module.exports = Tree