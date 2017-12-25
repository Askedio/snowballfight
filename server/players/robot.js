"use strict";

class Robot extends require('./base') {
  constructor(name, room) {
    super()

    this.name = name
    this.uid = this.name

    this.init(require('../socket').RoomState.get(room))
    this.robot = true
    this.health = 1
    this.setHealthFrame()
    this.alive = false
    this.weaponSettings = {
      name: 'default',
      speed: 500,
      fireRate: 2500,
      total: 1,
      sprite: 'bullet',
      bulletAngleOffset: 90,
      bulletAngleVariance: 0,
      damage: 1,
      bulletSpeedVariance: 0,
      fireRateVariance: 500,
      bulletLifespan: 300
    }
    this.move = {
      speed: 120,
      rotation: 1,
      isFireing: false,
      isAltFireing: false
    }
    this.username = name
  }
}

module.exports = Robot