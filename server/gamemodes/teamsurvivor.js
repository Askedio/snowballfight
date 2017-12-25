"use strict";

class Teamsurvivor extends require('./base') {
  constructor(map) {
    super(map)

    this.teamScoreMode = 'kills' // obsticals
    this.teamMode = 'tdm' // tdm

    this.playerRespawnTime = false
    this.limitedLives = 1
    this.disableSpawnWhenPlaying = true


    this.mode = 'teamsurvivor'
    this.headline = {
      title: 'team survivor',
      message: 'you only live once!',
    }

    this.setObsticals('default', 'itemspawns')
  }
}

module.exports = Teamsurvivor