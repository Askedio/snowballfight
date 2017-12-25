"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');

class GameModes {
  constructor(map) {
    this.map = map
    this.mode = null

    this.teamScoreMode = null // obsticals
    this.teamMode = false // tdm
    this.disableSpawnWhenPlaying = false


    this.headline = {
      title: null,
      message: null,
    }

    // Layers used for this game mode.
    this.layers = {
      base: 'base',
      colissions: 'Colissins',
      land: 'Tile Layer 1',
      spawnLayer: 'spawns',
    }

    this.timed = true
    this.timeLimit = 1 * 60 * 1000
    this.timeRemaining = this.timeLimit
    this.respawn = 15000 // time to start telling users when next maps loading
    this.respawnDelay = 1000 // time before maps done before alowed to play
    this.scoring = 'combo'
    this.obsticals = {}
    this.moveableDelay = 1500
    this.playerRespawnTime = 2000
    this.limitedLives = false

    this.resetPlayersOnEnd = false


    this.maxHealth = 10
    this.baseHealth = 8

    this.maxBots = 0
    this.allowedBotsPerPlayer = 0

    this.baseWeapon = require('../weapons').get().default
  }

  setTimelimit(time) {
    this.timeLimit = time * 60 * 1000
    this.timeRemaining = this.timeLimit
  }

  setRespawnDelay(seconds) {
    this.respawnDelay = seconds * 1000
  }

  setCountdownTime(seconds) {
    this.respawn = seconds * 1000
  }

  getSpawnTileType(player) {
    return 'spawn'
  }

  setObsticals(group, layer) {
    this.obsticalGroup = new(require('../obsticalgroups/' + group))(this.map, layer)
    this.obsticals = this.obsticalGroup.get()

    this.obsticalGroup.on('obsticalRespawn', (data) => {
      this.emit('obsticalRespawn', data)
    })

    this.obsticalGroup.on('obsticalKill', (data) => {
      this.emit('obsticalKill', data)
    })

    this.obsticalGroup.on('flagCapture', (data) => {
      this.emit('flagCapture', data)
    })
  }
}

module.exports = GameModes

util.inherits(GameModes, EventEmitter);