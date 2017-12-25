"use strict";

class Treeland extends require('./base') {
  constructor(map) {
    super(map)

    this.mode = 'treeland'
    this.headline = {
      title: 'tree land',
      message: 'kill all the trees before time runs out',
    }

    this.scoring = 'simple'
    this.setObsticals('treeland', 'treemode')

    this.baseWeapon = require('../weapons').get().devil
    this.maxHealth = 50
    this.baseHealth = 50

  }
}

module.exports = Treeland