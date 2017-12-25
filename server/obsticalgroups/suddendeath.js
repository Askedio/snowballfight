"use strict";

class Suddendeath extends require('./base') {
  constructor(map, layer) {
    super(map, layer)

    this.createMultiple(4, 'devil')
      .createMultiple(4, 'health', {
        values: {
          bulletHit: {
            health: -5
          },
          bulletKill: {
            health: 0
          },
          collide: {
            health: +10
          },
          kill: {
            health: 0
          },
        }
      })
  }
}

module.exports = Suddendeath