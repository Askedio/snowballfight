"use strict";

class Treeland extends require('./base') {
  constructor(map, layer) {
    super(map, layer)

    this.spawnType = 'inline'

    this.createMultiple(8, 'health')

    this.generateTrees(50, {
      respawn: false
    })
  }
}

module.exports = Treeland