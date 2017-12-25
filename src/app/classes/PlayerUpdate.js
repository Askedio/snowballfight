import PlayerMovement from './PlayerMovement'

export default class extends PlayerMovement {
  constructor() {
    super()
  }

  updatePlayer() {
    if (!this.alive) {
      return
    }

    if (this.player) {
      return this.updateLocalPlayer()
    }

    if (this.robot) {
      return this.updateRobot()
    }
  }


  updateState(data) {
    process.env.NODE_ENV != 'production' && console.log(data)
    this.lastState = data

    this.weapon.isAltFireing = false
    this.weapon.isFireing = false

    if (data.hasOwnProperty('moveable') && data.moveable == true) {
      this.tank.alpha = 1
    }

    if (data.hasOwnProperty('moveable') && data.moveable == false) {
      this.tank.alpha = .5
    }

    if (data.hasOwnProperty('skin')) {
      this.skin = data.skin
      this.setDefaultSkin()
    }

    if (data.hasOwnProperty('username')) {
      this.setName(data.username)
    }

    if (data.hasOwnProperty('healthFrame')) {
      this.healthSprite.frame = data.healthFrame
    }

    if (data.hasOwnProperty('weaponSettings')) {
      Object.assign(this.weapon.settings, data.weaponSettings)
      this.weapon.reset()
    }

    if (data.hasOwnProperty('altWeaponSettings')) {
      Object.assign(this.altWeapon.settings, data.altWeaponSettings)
      this.altWeapon.reset()
    }

    if (data.hasOwnProperty('alive') && this.alive && data.alive == false) {
      this.kill()

      if (this.player && data.killer && this.app.state.active.players[data.killer]) {
        if (this.app.state.active.players[data.killer].alive) {
          this.setCamera(this.app.state.active.players[data.killer].tank)
        }

        this.setKilledBy('killed by ' + (this.app.state.active.players[data.killer].username))
      }
    }

    if (data.hasOwnProperty('alive') && this.alive == false && data.alive == true) {
      if (this.newPosition) {
        this.tank.x = this.newPosition.x
        this.tank.y = this.newPosition.y
        if (this.future) {
          this.future.x = this.newPosition.x
          this.future.y = this.newPosition.y
        }
        this.moveGroup()
      }

      this.show()
    }

    if (data.hasOwnProperty('removeSprites')) {
      for (var sprite in data.removeSprites) {
        sprite = data.removeSprites[sprite]
        if (!this.sprites[sprite]) {
          continue
        }

        var _sprite = this.sprites[sprite]

        this.group.remove(_sprite)
        _sprite.destroy()
        delete this.sprites[sprite]
      }
    }


    if (data.hasOwnProperty('addSprite')) {
      for (var sprite in data.addSprite) {
        if (this.sprites[sprite]) {
          continue
        }

        var _data = data.addSprite[sprite]
        var _sprite = this.sprites[sprite] = this.game.add.sprite(this.tank.x, this.tank.y, _data.sprite)
        _sprite.enableBody = true

        _sprite.frame = _data.frame || 0
        _sprite.anchor.set(_data.anchorX || 1.3, _data.anchorY || 1.2)
        _sprite.scale.setTo(_data.scaleX || .08, _data.scaleY || .08)
        _sprite.alpha = _data.alpha || .8

        if (_data.tint) {
          _sprite.tint = _data.tint;
        }

        if (data.addSprite.width) {
          _sprite.width = _data.width
        }

        if (data.addSprite.height) {
          _sprite.height = _data.height
        }

        _sprite.name = sprite

        this.group.add(_sprite)
      }
    }

    for (let d in data) {
      if (d == 'uid' || d == 'player' || d == 'addSprite' || d == 'snapshots' || d == 'world' || d == 'name') {
        continue
      }
      this[d] = data[d]
    }

    this.updatePlayer()
  }



  update() {



    if (this.player) {



      var keypressed = false


      this.future.body.velocity.x = 0;
      this.future.body.velocity.y = 0;
      this.future.body.angularVelocity = 0;

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.future.body.angularVelocity = -170;
        this.usingKeyboard = true
        keypressed = true

      } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.future.body.angularVelocity = 170;
        this.usingKeyboard = true
        keypressed = true
      }

      if (this.moveable) {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
          this.game.physics.arcade.velocityFromAngle(this.future.angle, this.speed + 30, this.future.body.velocity);
          this.usingKeyboard = true
          keypressed = true
        }
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
        this.weapon.fire()
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
        this.weapon.altFire()
      }

      if (this.usingKeyboard) {
        this.updateMovementAnimation()
        if (!this.speed) {
          this.speed = this.minSpeed
        }

        if (!keypressed) {
          this.speed = 0
        }

        this.checkColissions()


        return
      }

      this.speed = this.getActiveSpeed()
      this.checkColissions()

      this.future.rotation = this.game.physics.arcade.angleToPointer(this.tank) || 10

      if (this.moveable && this.alive && this.speed && (this.usingKeyboard || this.mouseInScreen)) {
        this.game.physics.arcade.moveToXY(this.future, this.game.input.worldX, this.game.input.worldY, this.speed)
      } else {
        this.game.physics.arcade.moveToXY(this.future, this.tank.worldX, this.tank.worldY, 0)
      }

    } else {

      this.checkColissions()
    }

    if (!this.usingKeyboard && !this.mouseInScreen) {
      this.speed = 0
    }

    this.graphics9.x = this.future.x
    this.graphics9.y = this.future.y

    this.updateMovementAnimation()
    this.updatePlayer()

  }

}