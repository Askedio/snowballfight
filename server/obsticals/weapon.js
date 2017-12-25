"use strict";

class Weapon extends require('./base') {
  constructor(name, state) {
    super(name)


    this.width = 52
    this.height = 52
    this.sprite = '109'
    this.type = 'weapon'
    this.spawnTile = 'cannon'
    this.weapon = 'cannon'
    this.blocking = false
    this.bulletKills = false
    this.killOnColission = false
    this.autospawn = true


    this.deleteOnImpact = true
    this.killBulletOnColission = true
    this.resetIn = 3000
    this.body = {
      width: 400,
      height: 400,
      x: 50,
      y: 50
    }
  }
}

module.exports = Weapon