"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');

class ObsticalGroup {
  constructor(map, layer) {
    this.map = map
    this.layer = layer
    this.obsticals = {}
    this.spawnType = 'random'
    this.mapData = require('../../src/public/assets/maps/' + this.map + '/map.json')
    this.spawnTiles = new(require('../spawntiles'))(this.mapData, this.layer)
  }

  get() {
    for (var obstical in this.obsticals) {
      if (!this.obsticals[obstical].x) {
        delete this.obsticals[obstical]
      }
    }
    return this.obsticals
  }

  create(name, type, settings) {
    settings = settings || []
    var results = new(require("../obsticals/" + type + ".js"))(name, this.state)

    if (settings) {
      Object.assign(results, settings)
    }

    results.on('respawn', (data) => {
      if (data.randomizeRespawn) {
        var spawn = this.spawnTiles.setLayer(this.layer).getRandomTile(data.spawnTile)
        if (spawn) {
          results.x = spawn.x
          results.y = spawn.y
        }
      }
      this.emit('obsticalRespawn', data)
    })

    results.on('kill', (data) => {
      this.emit('obsticalKill', data)
    })

    results.on('flagCapture', (player) => {
      this.emit('flagCapture', player)
    })


    if (!results.x || !results.y) {
      if (this.spawnType == 'random' || settings.spawnType == 'random') {
        var spawn = this.spawnTiles.setLayer(this.layer).getRandomTile(results.spawnTile || type)
      }

      if (this.spawnType == 'inline' || settings.spawnType == 'inline') {
        var spawn = this.spawnTiles.setLayer(this.layer).getNextTile(results.spawnTile || type)
      }

      if (!spawn) {
        return this
      }

      results.x = spawn.x
      results.y = spawn.y
    }

    this.obsticals[name] = results

    return this
  }

  createMultiple(limit, what, settings) {
    for (var i = 0; i < limit; i++) {
      this.create(what + i, what, settings)
    }

    return this
  }

  generateTrees(limit, settings) {
    settings = settings || {}
    this.createMultiple(limit, 'tree', Object.assign(settings, {
      spawnType: 'inline'

    }))
  }
}

module.exports = ObsticalGroup

util.inherits(ObsticalGroup, EventEmitter);