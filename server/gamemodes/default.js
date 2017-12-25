"use strict";

class Default extends require('./base') {
  constructor(map) {
    super(map)


    this.mode = 'default'
    this.headline = {
      title: 'free for all',
      message: 'kill it all!',
    }

    this.setObsticals('default', 'itemspawns')
  }
}

module.exports = Default