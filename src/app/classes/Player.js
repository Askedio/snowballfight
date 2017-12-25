import {
  randomProperty,
  getRandomInt
} from '../utils'
import {
  updateQueryStringParameter
} from '../utils'
import Weapon from './Weapon'
import PlayerLocal from './PlayerLocal'


var Vec2 = require('vec2');

export default class extends PlayerLocal {
  constructor(app, uid, alive, player, robot, data) {
    super()

    process.env.NODE_ENV != 'production' && console.log('creating player..', uid, alive, player, this, data)

    this.app = app
    this.player = player
    this.game = this.app.game
    this.name = uid
    this.robot = robot
    this.owner = null
    this.lastExplosion = 'explosion'
    this.moveSound = this.game.audio.move1
    this.colission = false
    this.lastState = false
    this.spawnIndex = 0
    this.killer = null
    this.username = ''
    this.collideWithEnemy = false
    this.health = 0
    this.kills = 0
    this.deaths = 0
    this.alive = alive
    this.moveable = true
    this.isDoubleClick = false
    this.sprite = 'players'
    this.skin = 'playera'
    this.loadSkin = this.skin
    this.objectsKilled = 0
    this.minSpeed = 100
    this.maxSpeed = 200
    this.speed = -1
    this.newPosition = false
    this.usingKeyboard = false
    this.mouseInScreen = true
    this.moves = []
    this.tweens = []
    this.hasRobots = []
    this.sprites = {}

    this.create()
    this.addToState()
    this.showOrHide(alive)
  }

  // up top for dom replacement
  setKilledBy(value) {
    document.getElementById('killedBy').innerHTML = value
  }

  getRoomName() {
    return document.getElementById('playerRoom').value.toLowerCase().replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "-").substring(0, 32) || 'default'
  }

  hideGameModeChange() {
    document.getElementById('gameModeChange').style.display = 'none'
  }

  setRoom(room) {
    document.getElementById('playerRoom').value = room
  }

  //
  create() {
    this.createWeapons()
    this.createGroups()
    this.createPlayer()
    this.addEnemyGroup()
    this.setDefaultSkin()
    this.createAnimations()
    this.watchMouse()
    this.createSprites()
    this.createUsername()
    this.emitMovements()
  }

  createWeapons() {
    this.weapon = new Weapon(app, this)
    this.altWeapon = new Weapon(app, this)
  }

  createGroups() {
    this.group = this.game.add.group()
    this.altgroup = this.game.add.group()
  }

  createPlayer() {
    this.tank = this.game.add.sprite(0, 0, this.sprite)

    this.tank.anchor.set(0.5, 0.5)
    this.tank.name = this.name

    this.game.physics.enable(this.tank, Phaser.Physics.ARCADE)
    this.tank.body.collideWorldBounds = true
    this.tank.angle = this.game.rnd.angle()
    this.tank.body.setSize(38, 38, 5, 5)
  }

  createAnimations() {
    this.tank.animations.add('playera', this.getSkinFrames('playera'))
    this.tank.animations.add('playerb', this.getSkinFrames('playerb'))
    this.tank.animations.add('playerc', this.getSkinFrames('playerc'))
    this.tank.animations.add('playerd', this.getSkinFrames('playerd'))

    this.explosion = this.game.explosion
  }

  createSprites() {
    if(this.player) {
      this.creatTesterSprite()
      this.createGraphicsSprite()
    }

    this.createFutureSprite()

    this.createHealthSprite()
  }

  creatTesterSprite() {
    this.tester = this.game.add.graphics(0, 0);
    this.tester.drawCircle(0, 0, 80);
    this.game.physics.enable(this.tester, Phaser.Physics.ARCADE)
    this.tester.anchor.set(0.5, 0.5)
  }

  createFutureSprite() {
    this.future = this.game.add.graphics(this.tank.x, this.tank.y)
    this.future.anchor.set(.6, .5)
    this.future.drawCircle(0, 0, 60)
    this.game.physics.enable(this.future, Phaser.Physics.ARCADE)
    this.future.x = this.tank.x
    this.future.y = this.tank.y
    this.future.beginFill(0xFFFFFF, 1)

    this.graphics9 = this.game.add.graphics(0, 0)
    this.graphics9.beginFill(0xFFFFFF, 1)
    this.graphics9.anchor.set(.6, .5)
    this.graphics9.alpha = .2
    this.graphics9.drawCircle(0, 0, 70)
    this.graphics9.enableBody = true

  }

  createGraphicsSprite() {
    this.graphics = this.game.add.graphics(0, 0)
    this.graphics.beginFill(0xFFFFFF, 1)
    this.graphics.anchor.set(.6, .5)
    this.graphics.alpha = .2
    this.graphics.drawCircle(0, 0, 70)
    this.graphics.enableBody = true
    this.graphics.name = 'playerSurround'
    this.group.add(this.graphics)
  }

  createHealthSprite() {
    this.healthSprite = this.game.add.sprite(this.tank.x, this.tank.y, 'health')
    this.healthSprite.frame = 4
    this.healthSprite.anchor.set(1.3, 1.2)
    this.healthSprite.enableBody = true
    this.healthSprite.scale.setTo(.08, .08)
    this.healthSprite.alpha = .8
    this.healthSprite.immovable = false
    this.healthSprite.name = 'healthSprite'
    this.group.add(this.healthSprite)
  }

  createUsername() {
    this.text = this.game.add.text(0, 0, this.username, {
      font: "11px Helvetica Neue",
      fill: "#000000",
      align: "left",
    })
    this.text.anchor.set(.5, 2.1)
    this.text.alpha = .7
    this.text.name = 'userText'
    this.group.add(this.text)

    this.createUserEmoji()
  }

  setUsername(name) {
    this.username = name ? name.toLowerCase().replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "-").substring(0, 32) : ''

  }

  setName(name) {
    this.setUsername(name)
    this.text.setText(this.username)
    this.createUserEmoji()

  }

  getEmoji() {
    if(!this.username) {
      return false
    }

    var username = this.username.substring(0,4)

    if(['🇺🇸', '🇪🇸'].indexOf(username) != -1) {
      this.text.setText(this.username.substring(4))
      return username
    }

    var username = this.username.substring(0,2)


    if(['💀', '💩'].indexOf(username) != -1) {
      this.text.setText(this.username.substring(2))
      return username
    }

    return false
  }


  createUserEmoji() {
    var _emoji = this.getEmoji()

    if(_emoji) {
      if(this.userEmojiOverlay) {
        console.log('asdf')
        this.userEmojiOverlay.setText(_emoji)
        return
      }

      this.userEmojiOverlay = this.game.add.text(0, 0, _emoji, {
        font: "76px Helvetica Neue",
        align: "left",
      })

      this.userEmojiOverlay.anchor.set(.5, .4)
      this.group.add(this.userEmojiOverlay)
      this.userEmojiOverlay.alpha = .1
    }

  }

  addToState() {
    this.app.state.active.players[this.name] = this
  }

  showOrHide(alive){
    if (!alive) {
      this.hide()
      return
    }

    this.show()
  }

  getRoom() {
    var room = this.getRoomName()

    if (this.game.newroom) {
      room = this.game.newroom
      this.hideGameModeChange()
      if (room != 'default') {
        this.setRoom(room)
        updateQueryStringParameter('join', room)
      }
      this.game.newroom = null
    }

    return room
  }

  spawn() {
    this.app.socket.emit('revive', {
      username: document.getElementById('playerName').value,
      room: this.getRoom(),
      skin: this.loadSkin
    })
  }

  hide() {
    this.tank.kill()
    this.future && this.future.kill()
    this.group.callAll('kill')
  }

  kill(reset) {
    this.hide()

    if (!reset) {
      process.env.NODE_ENV != 'production' && console.log('killed player', this)
      this.explode()
    }

    setTimeout(() => {
      if (this.player) {
        this.app.spawnScreen.show()
      }
    }, 500)
  }


  show() {
    this.revive()
    this.moveGroup()
    this.setKilledBy('')
    this.setCamera(this.graphics)
  }

  revive() {
    this.tank.revive()
    this.future && this.future.revive()
    this.group.callAll('revive')
  }


  getSkinFrames(type) {
    if (type == 'playera') {
      return [0, 1, 2, 3]
    }

    if (type == 'playerb') {
      return [4, 5, 6, 7]
    }

    if (type == 'playerc') {
      return [8, 9, 10, 11]
    }

    if (type == 'playerd') {
      return [12, 13, 14, 15]
    }

    return [0, 1, 2, 3]
  }

  setDefaultSkin() {
    this.tank.frame = this.getSkinFrames(this.skin)[0]
  }

  removeFromState() {
    delete this.app.state.active.players[this.name]
  }

  destroyObjects() {
    this.tank.kill()
    this.group.destroy()
  }

  destroy() {
    this.destroyObjects()
    this.tank.kill()
    this.group.destroy()
    this.removeFromState()
    this.removeEnemyGroup()
    this.destroyLocalPlayer()
  }

  isPlayerFireing() {
    var results = this.game.input.activePointer.leftButton.isDown || this.isDoubleClick
    if (results && this.usingKeyboard) {
      this.usingKeyboard = false
    }
    return results
  }

  isPlayerAltFireing() {
    return this.game.input.activePointer.rightButton.isDown
  }

  suicide() {
    this.app.socket.emit('suicide')
  }

  setExplosion() {
    if (this.explosion == this.game.explosion) {
      this.explosion = this.game.explosion2
      return
    }

    this.explosion = this.game.explosion
  }

  explode(onComplete) {
    this.game.audio.explosion.play(null, 0, this.game.audio.explosion.isPlaying ? .2 : .1)

    this.setExplosion()

    var explosion = this.explosion

    explosion.reset(this.tank.x, this.tank.y)
    explosion.revive()


    var animation = explosion.animations.play('kaboom', 30)
    animation.onComplete.add(() => {
      explosion.kill()
    })
  }
}