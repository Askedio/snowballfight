import PlayerColissions from './PlayerColissions'

export default class extends PlayerColissions {
  constructor() {
    super()
  }

  moveGroup() {


    this.group.forEachAlive((platform) => {
      this.moveObject(platform, {
        x: this.future.x,
        y: this.future.y,
        rotation: this.future.rotation - 89.5
      })
    })

    if(!this.tank){
      return
    }

    this.moveObject(this.tank, {
      x: this.future.x,
      y: this.future.y,
      rotation: this.future.rotation
    })
  }

  moveObject(object, data){
    Object.assign(object, data)
  }

  interpolate(a, b, frac) // points A and B, frac between 0 and 1
  {
      var nx = a.x+(b.x-a.x)*frac;
      var ny = a.y+(b.y-a.y)*frac;
      return {x:nx,  y:ny};
  }

  newMove(data) {
    if (!this.alive  ) {
      return
    }

    var _tween = 40
    if (distance > 60) {
      _tween = 40
    }

    var distance = this.game.physics.arcade.distanceBetween(this.tank, {
      x: data.x,
      y: data.y
    })


    if(this.player) {
      var newdata = this.interpolate(this.future, data, .1)

      data.x = newdata.x
      data.y  = newdata.y
    } else {




      this.game.physics.arcade.moveToXY(this.future, data.ix, data.iy, data.speed )
      var newdata = this.interpolate(this.future, data, .1)

      data.x = newdata.x
      data.y  = newdata.y
      _tween = 80


    }




    this.tank.rotation = data.rotation

    if (this.moveable) {
      this.moveTween && this.moveTween.isRunning && this.moveTween.stop()
      this.moveTween = this.game.add.tween(this.tank).to({
        x: data.x,
        y: data.y,
      }, _tween, Phaser.Easing.Linear.None, true)
    }

    this.group.forEachAlive((platform) => {
      ((this.tweens[platform.name] && this.moveTween && this.moveTween.isRunning) || (this.tweens[platform.name] && this.tweens[platform.name].isRunning)) && this.tweens[platform.name].stop()
      if (this.moveable) {
        this.tweens[platform.name] = this.game.add.tween(platform).to({
          x: data.x,
          y: data.y,
        }, _tween, Phaser.Easing.Linear.None, true)
      }

      platform.rotation = data.rotation - 89.5
    })

    if (!this.moveable) {
      return
    }


    if (data.isFireing) {
      this.weapon.weapon.bullets.setAll('name', 'reg')
      this.weapon.fire()
    }

    if (data.isAltFireing) {
      this.altWeapon.weapon.bullets.setAll('name', 'alt')
      this.altWeapon.altFire()
    }
  }

  updateMovementAnimation() {
    if (this.speed > 0 && this.moveable) {
      this.tank.body.moves = false
      this.tank.animations.play(this.skin || 'playera', this.speed > this.maxSpeed - 40 ? 6 : 5, true)
    } else {
      this.tank.animations.stop()
      this.tank.body.moves = false
      this.setDefaultSkin()
    }
  }


  getActiveSpeed() {
    if (!this.player) {
      return this.speed
    }

    var distance = this.game.physics.arcade.distanceToPointer(this.tank)
    var speed = Math.round(distance * 1.4)

    if (!this.alive || !this.moveable) {
      return 0
    }

    if (distance <= 60) {
      return 0
    }

    if (speed <= this.minSpeed) {
      return this.minSpeed
    }

    if (speed >= this.maxSpeed) {
      return this.maxSpeed
    }

    return speed
  }




  updateRobots(results) {
    if (this.hasRobots.length && this.alive) {
      for (var robot of this.hasRobots) {
        if (!this.getRobot(robot)) {
          continue
        }

        results.moveRobots.push(this.emitRobotData(robot))
      }
    }
  }

  getRobot(player) {
    return this.app.state.active.players[player]
  }

}