import PlayerUpdate from './PlayerUpdate'

export default class extends PlayerUpdate {
  constructor() {
    super()

    this.snapshots = []
    this.updateRate = 50 // How fast, in ms, to update player movements to the server.
  }

  addEnemyGroup() {
    if (this.player) {
      return
    }

    this.game.enemyGroup.add(this.tank)
  }

  removeEnemyGroup() {
    if (this.player) {
      return
    }

    this.game.enemyGroup.remove(this.tank)
  }

  mouseEnter() {
    this.mouseInScreen = true
  }

  mouseLeave() {
    this.mouseInScreen = false
  }

  setCamera(object) {
    if (!this.player) {
      return
    }

    this.game.camera.follow(object)
  }

  destroyLocalPlayer() {
    if (!this.player) {
      return
    }

    clearInterval(this.moveInterval)
    clearInterval(this.testerInterval)
    document.removeEventListener("mouseenter", this.mouseEnter)
    document.removeEventListener("mouseleave", this.mouseLeave)
  }


  emitMovements() {
    if (!this.player) {
      return
    }

    setTimeout(() => {
      this.moveInterval = setInterval(() => {
        if (this.snapshots.length) {
          this.app.socket.emit('move', require('jsonpack').pack(this.snapshots))
          this.snapshots = []
        }
      }, this.updateRate);


      this.testerInterval = setInterval(() => {
        var data = this.emit()
        if(data) {
          this.snapshots.push(data)
        }

        if (!this.tester) {
          return
        }
        this.game.physics.arcade.moveToPointer(this.tester, 1000)
      }, 15);



    }, 300) // delay loading to avoid issues

  }


  emitRobotData(robot) {
    var _robot = this.getRobot(robot)

    return {
      name: robot,
      speed: _robot.speed,
      x: _robot.tank.world.x,
      y: _robot.tank.world.y,
      rotation: _robot.tank.rotation,
      isFireing: _robot.weapon.isFireing,
      isAltFireing: _robot.weapon.isAltFireing
    }
  }

  emit() {
    if (!this.alive) {
      return
    }

    var results = {
      speed: this.speed,
      x: this.future.world.x,
      y: this.future.world.y,
      ix: this.game.input.worldX,
      iy: this.game.input.worldY,
      rotation: this.future.rotation,
      isFireing: this.isPlayerFireing(),
      isAltFireing: this.isPlayerAltFireing(),
      moveRobots: [],
      timestamp: Date.now(),
      uid: this.name
    }

    this.updateRobots(results)

    return results
  }

  updateRobot() {
    if (!this.owner || this.owner != this.app.player.name) {
      return
    }

    var distance = this.game.physics.arcade.distanceBetween(this.tank, this.app.player.tank)

    if (distance < 220 && distance > 99 && this.moveable && this.app.player.moveable) {
      this.weapon.fire()
    }

    if (this.app.player.speed) {
      this.speed = this.app.player.speed - getRandomInt(70, 100)
    }

    if (!this.speed || this.speed < 100) {
      this.speed = 100
    }

    if (distance < 200) {
      this.speed = 0
    }

    this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, this.app.player.tank)

    // dupe if else
    if (!this.moveable) {
      this.speed = 0
      return
    }

    if (distance > 300) {
      this.game.physics.arcade.moveToXY(this.tank, this.game.input.worldX, this.game.input.worldY, this.speed)
      this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, {
        x: this.game.input.worldX,
        y: this.game.input.worldY
      })

      return
    }

    this.game.physics.arcade.moveToXY(this.tank, this.app.player.tank.x, this.app.player.tank.y, this.speed)
  }

  watchMouse() {
    if (!this.player) {
      return
    }

    document.addEventListener("mouseenter", this.mouseEnter.bind(this), false)
    document.addEventListener("mouseleave", this.mouseLeave.bind(this), false)

    this.game.input.onTap.add((pointer, isDoubleClick) => {
      if (!isDoubleClick) {
        return;
      }

      this.isDoubleClick = true

      setTimeout(() => {
        this.isDoubleClick = false
      }, 50)
    });
  }


  updateLocalPlayer() {
    if (this.collideWithEnemy) {
      this.graphics.alpha = .4
    } else {
      this.graphics.alpha = .3
    }

    var scale = 1 + this.speed * .0005
    this.graphics.scale.setTo(scale, scale)
  }

}