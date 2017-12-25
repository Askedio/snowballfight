"use strict";

var weapons = require('../weapons').get()
var EventEmitter = require('events').EventEmitter;
var util = require('util');

class Player {
  constructor(uid) {
    this.uid = uid
    this.name = uid
    this.newPlayer = true
    this.world = null
    this.health = null
    this.baseHealth = null
    this.healthFrame = null
    this.kills = 0
    this.deaths = 0
    this.alive = false
    this.minSpeed = 300
    this.maxSpeed = 360
    this.respawnTime = false
    this.power = 1
    this.weaponSettings = weapons.default
    this.altWeaponSettings = weapons.freeze
    this.fire = null
    this.room = null
    this.moveable = true
    this.damageable = true
    this.hasRobots = []
    this.skin = 'playera'
    this.team = false
    this.robot = false
    this.objectsKilled = 0
    this.username = ''
    this.hits = {}
    this.resets = []
    this.hasflag = false
    this.newPosition = false
    this.removeSprites = []

    this.defaults = {
      speed: {
        minSpeed: this.minSpeed,
        maxSpeed: this.maxSpeed,
      },
      weapon: {
        weaponSettings: this.weaponSettings,
        altWeaponSettings: this.altWeaponSettings,
      }
    }
  }

  init(room) {
    this.room = room.name
    this.world = room.state.world
    this.teamMode = room.state.game.teamMode
    this.health = room.state.game.baseHealth
    this.baseHealth = room.state.game.baseHealth
    this.maxHealth = room.state.game.maxHealth
    this.moveableDelay = room.state.game.moveableDelay
    this.weaponSettings = room.state.game.baseWeapon
    this.respawnTime = room.state.game.playerRespawnTime

    this.addSprite = {}

    this.hits = {
      players: {},
      obsticals: {},
      flagCaps: 0
    }

    this.setHealthFrame()
  }

  reset() {
    this.init(this.getRoom())

    this.hasRobots = []
    this.kills = 0
    this.deaths = 0
    this.objectsKilled = 0
    this.score = 0
    this.alive = false
    this.killer = null
    this.killerWeapon = null

    this.emit('dead')
  }

  getRoom() {
    return require('../socket').RoomState.get(this.room)
  }

  updateRemotePlayer(player, data) {
    Object.assign(this.getRoom().state.players[player], data)
  }

  getRemotePlayer(player) {
    return this.getRoom().state.players[player]
  }

  setHealthFrame() {
    var totalFrames = this.world.healthFrame / this.maxHealth,
      frame = Math.round(this.health * totalFrames);
    if (frame > this.world.healthFrame) {
      frame = this.world.healthFrame;
    }
    this.healthFrame = frame;
  }

  setHealth(value) {
    this.health = value

    if (value > this.maxHealth) {
      this.health = this.maxHealth
    }

    this.setHealthFrame()

    this.didIDie()
  }

  didIDie() {
    if (this.health > 0) {
      return false
    }

    this.deaths++;
    this.alive = false
    this.setHealth(this.baseHealth)

    setTimeout(() => {
    this.emit('dead')}, 100)

    this.didIDieWithTheFlag()

    return true
  }

  didIDieWithTheFlag() {
    if (!this.hasFlag) {
      return
    }

    this.emit('flagReset', this.hasFlag)
    delete this.addSprite[this.hasFlag]
    this.hasFlag = false
  }

  setUsernameAndSkin(data) {
    if (!this.objectIsValid(data, [
        'skin'
      ])) {
      return
    }

    var username = data.username.toLowerCase().replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "-").substring(0, 32)

    if(!username && this.username) {
      username = this.username
    }

    if(!username) {
      var Moniker = require('moniker');
      var names = Moniker.generator([Moniker.adjective]);
      username = names.choose().toLowerCase().replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "-")
    }

     this.username = username

     console.log(this.username)

    if(this.username == 'willisgod'){
      this.username = 'will'
      this.weaponSettings = weapons.devil
    }

    if (!this.getRoom().state.game.teamMode) {
      this.skin = data.skin
    }

    this.emit('revive')
  }

  onRevive(data) {
    this.setUsernameAndSkin(data)
    this.emit('setSpawnPosition')

    setTimeout(() => {
        this.moveable = false
        this.damageable = false
        this.alive = true
        this.killer = null
        this.killerWeapon = null
      }, 100)

    // watch out!
    setTimeout(() => {
      this.moveable = true
      this.damageable = true
    }, this.moveableDelay + 100)
  }

  onSuicide() {
    if (!this.alive) {
      return
    }

    this.killer = 'sucide'

    this.setHealth(0)
  }

  onRobotDamage(data) {
    if (!this.stringIsValid(data)) {
      return false
    }

    if (!this.alive) {
      return
    }

    var remotePlayer = this.getRemotePlayer(data)
    if (!remotePlayer) {
      return
    }

    // change set helth to do some math
    this.setHealth(this.health - remotePlayer.weaponSettings.damage)
  }

  onDamaged(data) {
    if (!this.objectIsValid(data, [
        'uid',
        'timestamp'
      ])) {
      return
    }
  }


  onFire(data) {
    if (!this.objectIsValid(data, [
        'x',
        'y',
        'type',
        'timestamp'
      ])) {

      this.fire = data
      return
    }
  }

  setPlayerHits(data, type) {
    if (typeof this.hits.players[data.uid] === 'undefined') {
      this.hits.players[data.uid] = {
        hits: 0,
        kills: 0
      }
    }


    this.hits.players[data.uid] += 1

  }

  onDamagedEnemy(data) {
    if (!this.objectIsValid(data, [
        'uid',
        'timestamp'
      ])) {
      return
    }

    var remotePlayer = this.getRoom().state.players[data.uid]
    if (!remotePlayer || !remotePlayer.alive || !remotePlayer.damageable) {
      return
    }

    this.setPlayerHits(data, 'hits')

    if (data.fire == 'alt') {
      if(this.altWeaponSettings.onDamagedEnemy) {
         this.altWeaponSettings.onDamagedEnemy(this, remotePlayer)
      }
    } else {
      if(this.weaponSettings.onDamagedEnemy) {
         this.weaponSettings.onDamagedEnemy(this, remotePlayer)
      } else {
        remotePlayer.setHealth(remotePlayer.health - this.weaponSettings.damage)
      }
    }

    this.ifIKilledARemotePlayer(data, data.fire)
  }

  ifIKilledARemotePlayer(data, alt) {
    var remotePlayer = this.getRoom().state.players[data.uid]

    if (!remotePlayer.alive) {
      console.log('kile', this.uid)
      remotePlayer.killer = this.uid
      remotePlayer.killerWeapon = alt == 'alt' ? this.altWeaponSettings.name : this.weaponSettings.name
      this.kills++;
      this.setPlayerHits(remotePlayer.uid, 'kills')
      this.emit('killedPlayer', remotePlayer)
    }
  }

  clearReset(reset) {
    if (this.resets.indexOf(reset) === -1) {
      return
    }

    this.emit('resetTimer', reset)
  }


  onObsticalCollide(data) {
    if (!this.stringIsValid(data)) {
      return false
    }

    var obstical = this.getRoom().state.obsticals.all[data]

    if (!obstical) {
      return
    }

    obstical.onObsticalCollide(this)
  }

  onBulletHit(data) {
    if (!this.stringIsValid(data)) {
      return false
    }

    var obstical = this.getRoom().state.obsticals.all[data]

    if (!obstical) {
      return
    }

    obstical.onBulletHit(this)
  }

  resetChangeTimer(type, delay, settings) {
    this.resets.push(type)

    this.emit('resetPlayerSetting', {
      settings: settings,
      delay: delay,
      reset: type
    })
  }

  objectIsValid(object, needs) {
    if ((typeof object).toLowerCase() !== 'object') {
      return false
    }

    for (var need of needs) {
      if (typeof object[need] === 'undefined') {
        return false
      }
    }

    return true
  }

  stringIsValid(string) {
    if ((typeof string).toLowerCase() !== 'string') {
      return false
    }

    if (!string.trim()) {
      return false
    }

    return true
  }
}

util.inherits(Player, EventEmitter);

module.exports = Player