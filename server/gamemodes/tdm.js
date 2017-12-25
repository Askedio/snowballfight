"use strict";

class Tdm extends require('./base') {
  constructor(map) {
    super(map)

    this.teamScoreMode = 'kills' // obsticals
    this.teamMode = 'tdm' // tdm

    this.scoring = 'kills'

    this.mode = 'tdm'
    this.headline = {
      title: 'team death match',
      message: 'team up, kill em!',
    }

    this.setObsticals('default', 'itemspawns')
  }
}

module.exports = Tdm