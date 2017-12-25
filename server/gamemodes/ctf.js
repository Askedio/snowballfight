"use strict";

class Ctf extends require('./base') {
  constructor(map) {
    super(map)

    this.teamScoreMode = 'ctf' // obsticals
    this.teamMode = 'ctf' // tdm

    this.scoring = 'flags'

    this.mode = 'ctf'

    // disable friendly fire

    this.headline = {
      title: 'capture the flag',
      message: 'team up and capture!',
    }


    this.setObsticals('ctf', 'itemspawns')
  }
}

module.exports = Ctf