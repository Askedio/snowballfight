"use strict";

class Health extends require('./base') {
  constructor(name, state) {
    super(name)


    this.width = 52
    this.height = 52
    this.sprite = 'health'
    this.frame = 4
    this.type = 'health'
    this.bulletKills = true
    this.blocking = false
    this.autospawn = true
    this.deleteOnImpact = true
    this.killBulletOnColission = true

    // set reward value
    this.sounds = {
      onCollide: {
        sound: 'chime3'
      }
    }

    this.values = {
      bulletHit: {
        health: -1
      },
      bulletKill: {
        health: 0
      },
      collide: {
        health: +1
      },
      kill: {
        health: 0
      },
    }

    this.body = {
      width: 200,
      height: 200,
      x: 50,
      y: 50
    }
  }
}

module.exports = Health