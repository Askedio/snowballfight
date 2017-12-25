"use strict";

class SpawnTiles {
  constructor(mapData, layer) {
    this.mapData = mapData
    this.layer = layer
    this.allTiles = {}
    this.types = {}
    this.generate()
    this.availableTiles = this.allTiles

  }

  setLayer(layer) {
    this.layer = layer
    return this
  }

  generate() {
    for (var i in this.mapData.layers) {
      this.allTiles[this.mapData.layers[i].name] = this.spawnTiles(i)
    }
  }

  getRandomTile(type, dontRemove) {
    if (!this.allTiles[this.layer] || !this.availableTiles[this.layer][type]) {
      return false
    }

    var _tile = require('./utils').randomItem(this.availableTiles[this.layer][type])
    var _index = this.availableTiles[this.layer][type].indexOf(_tile)

    if (!dontRemove) {
    //  this.availableTiles[this.layer][type].splice(_index, 1)
    }

    return _tile
  }


  getNextTile(type) {
    if (!this.allTiles[this.layer] || !this.availableTiles[this.layer][type]) {
      return false
    }

    var _tile = this.availableTiles[this.layer][type].shift()
    return _tile
  }

  spawnTiles(layerIndex) {
    var tiles = []

    for (var item in this.mapData.tilesets[0].tileproperties) {
      var ii = this.mapData.tilesets[0].tileproperties[item]
      var i = item
      if (ii.type) {
        this.types[i] = ii.type
      }
    }

    var index = 0
    var tileSize = 2240 / 32

    for (var i in this.mapData.layers[layerIndex].data) {
      var type = this.mapData.layers[layerIndex].data[i]
      type = this.types[--type]

      if (type) {
        if (!tiles[type]) {
          tiles[type] = []
        }

        tiles[type].push({
          x: ((index % tileSize) * 32),
          y: (Math.floor(index / tileSize) * 32)
        })
      }

      index++
    }

    return tiles
  }
}
module.exports = SpawnTiles