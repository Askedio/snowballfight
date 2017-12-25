"use strict";

class Suddendeath extends require('./base') {
  constructor(map) {
    super(map)

    this.mode = 'suddendeath'
    this.headline = {
      title: 'sudden death',
      message: 'bleeeeeeeeeeeeeeed',
    }

    this.scoring = 'simple'
    this.setObsticals('suddendeath', 'suddendeath')

    this.maxHealth = 50
    this.baseHealth = 50

    this.layers = {
      base: 'base',
      colissions: 'suddendeathColissions',
      robotColissions: 'Robot Colissions',
      land: 'suddendeath',
      spawnLayer: 'spawns',
    }
  }
}

module.exports = Suddendeath