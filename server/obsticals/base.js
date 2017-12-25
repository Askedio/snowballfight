"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');

class Obstical {
  constructor(name, settings) {
    this.name = name
    this.settings = settings
    this.width = null
    this.height = null
    this.sprite = null
    this.type = null
    this.sounds = {}
    this.bulletKills = true
    this.blocking = false
    this.autospawn = true
    this.respawn = null
    this.deleteOnImpact = false
    this.killBulletOnColission = true
    this.alwaysPlay = false // play no matter what, devil sound
    this.playInView = false // play only if in view
    this.body = null
    this.deadReason = ''
    this.changesSettings = {}
    this.removesSettings = []
    this.randomizeRespawn = true
    this.killReward = 1
    this.stopsPlayer = false
    this.respawnRange = {
      min: 2,
      max: 10
    }

    this.values = {
      bulletHit: {
        health: 0
      },
      bulletKill: {
        health: 0
      },
      collide: {
        health: 0
      },
      kill: {
        health: 0
      },
    }

    this.respawn = () => {
      return setTimeout(() => {
        this.sendToRespawnState()
      }, require('../utils').getRandomInt(this.respawnRange.min * 1000, this.respawnRange.max * 1000));
    }
  }

  sendToRespawnState() {
    this.killer = null
    this.emit('respawn', this)
  }

  changePlayerSettings(player) {
    Object.assign(player, this.changesSettings)

    if (typeof this.removesSettings === 'function') {
      this.removesSettings(player)
    } else {
      this.removeSettings(player, this.removesSettings)
    }
  }

  removeSettings(player, settings) {
    for (var remove of settings) {
      player[remove] = null
    }
  }



  onObsticalCollide(player) {
    if (this.changesSettings) {
      if (typeof this.changesSettings === 'function') {
        this.changesSettings(player)
      } else {
        this.changePlayerSettings(player)
      }

      player.clearReset(this.type)
      this.resetIn && player.resetChangeTimer(this.type, this.resetIn, player.defaults[this.type])
    }


    if (this.values.collide.health) {
      player.setHealth(player.health + this.values.collide.health) //
    }

    if (this.deleteOnImpact) {
      this.deadReason = 'onCollide'
      this.killer = player.uid

      this.emit('kill', this)

      if (this.values.kill.health) {
        player.setHealth(player.health + this.values.kill.health) //
      }
    }
  }

  onBulletHit(player) {
    var _delete = false
    if (this.destroyable) {
      this.health -= 1

      if (this.health <= 0) {
        this.health = this.health
        _delete = true
      }

      player.objectsKilled += this.killReward

      if (typeof player.hits.obsticals[this.type] === 'undefined') {
        player.hits.obsticals[this.type] = 1
      } else {
        player.hits.obsticals[this.type] += 1
      }
    }

    if (this.values.bulletHit.health) {
      player.setHealth(player.health + this.values.bulletHit.health)
    }

    if (_delete || this.bulletKills) {
      this.deadReason = 'onKill'
      this.emit('kill', this)

      if (this.values.bulletKill.health) {
        player.setHealth(this.player + this.values.bulletKill.health)
      }
    }


  }
}

module.exports = Obstical

util.inherits(Obstical, EventEmitter);