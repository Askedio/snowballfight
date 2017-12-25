export default class {

  tankColliedWithEnemy() {
    this.game.physics.arcade.collide(this.tank, this.game.enemyGroup, (player, group) => {
      this.collideWithEnemy = true

      if (this.robot) {
        this.tank.body.velocity.setTo(this.getRandomInt(100, 200), this.getRandomInt(100, 200));
        this.tank.body.bounce.set(0, 1);
      }

      if (this.player) {
        this.app.socket.emit('enemyCollide', group.name)
      }
    })

    if (this.player) {
      this.game.physics.arcade.overlap(this.tester, this.game.enemyGroup, (player, group) => {
        this.testerCollide(group)
      })
    }
  }

  testerCollide(group) {
    var distance = this.game.physics.arcade.distanceBetween(this.tank, group)

    if (distance < 200) {
      this.speed = 0
    }
  }

  tankCollideWithObstical(player, obstical, trigger = true, tester = false) {
    var _obstical = this.app.state.getObstical(obstical.index)
    if (!_obstical) {
      return false
    }

    if (trigger) {
      _obstical.collide(this)
    }

    if (tester && _obstical.stopsPlayer) {
      this.testerCollide(obstical)
    }

    if (_obstical.blocking) {
      this.colission = true
    }

    return _obstical.blocking
  }


  tankCollideWithTopLayerGroup() {
    this.game.physics.arcade.collide(this.tank, this.game.topLayerGroup, (player, obstical) => {}, (player, obstical) => {
      return this.tankCollideWithObstical(player, obstical)
    })

    if (this.player) {
      this.game.physics.arcade.collide(this.future, this.game.topLayerGroup, (player, obstical) => {}, (player, obstical) => {
        return this.tankCollideWithObstical(player, obstical, false)
      })
      this.game.physics.arcade.overlap(this.tester, this.game.topLayerGroup, (player, obstical) => {}, (player, obstical) => {
        return this.tankCollideWithObstical(player, obstical, false, true)
      })
    }
  }

  tankCollideWithObsticalGroup() {
    this.game.physics.arcade.collide(this.tank, this.game.obsticalGroup, (player, obstical) => {}, (player, obstical) => {
      return this.tankCollideWithObstical(player, obstical)
    })

    if (this.player) {
      this.game.physics.arcade.overlap(this.tester, this.game.obsticalGroup, (player, obstical) => {}, (player, obstical) => {
        return this.tankCollideWithObstical(player, obstical, false, true)
      })
    }

  }

  tankCollideWithMapColissionLayer() {
    this.game.physics.arcade.collide(this.tank, this.game.map.colissionLayer, () => {
      this.colission = true
    })
    if (this.player) {
      this.game.physics.arcade.collide(this.future, this.game.map.colissionLayer, () => {
        this.colission = true
      })
      this.game.physics.arcade.collide(this.tester, this.game.map.colissionLayer, () => {
        this.colission = true
      })

    }
  }

  bulletsCollideWithObstical(bullet, obstical) {
    //process.env.NODE_ENV != 'production' && console.log('bullets obsticalGroup', obstical.name, bullet)

    var _obstical = this.app.state.getObstical(obstical.index)
    if (!_obstical) {
      return false
    }
    if (_obstical.bulletHit(bullet, this)) {
      this.weapon.killBullet(bullet, 'obsticalKill', _obstical.disablePlayBulletKillSound)
    }
  }

  bulletsCollideWithObsticalGroup() {
    this.game.physics.arcade.overlap([this.weapon.weapon.bullets, this.altWeapon.weapon.bullets], this.game.obsticalGroup, (bullet, obstical) => {
      this.bulletsCollideWithObstical(bullet, obstical)
    })
  }

  bulletsCollideWithTopLayerGroup() {
    this.game.physics.arcade.overlap([this.weapon.weapon.bullets, this.altWeapon.weapon.bullets], this.game.topLayerGroup, (bullet, obstical) => {
      this.bulletsCollideWithObstical(bullet, obstical)
    })
  }

  bulletsCollideWithEnemyGroup() {
    this.game.physics.arcade.overlap([this.weapon.weapon.bullets, this.altWeapon.weapon.bullets], this.game.enemyGroup, (bullet, player) => {
      //process.env.NODE_ENV != 'production' && console.log('bullets enemyGroup', player.name, bullet)

      if (player.name == this.name) {
        return
      }

      if (this.player) {
        this.app.socket.emit('damagedEnemy', {
          uid: player.name,
          fire: bullet.name,
          timestamp: Date.now()
        })
      }

      this.weapon.killBullet(bullet, 'enemyGroup')
    })
  }

  bulletsCollideWithMapColissionLayer() {
    this.game.physics.arcade.collide([this.weapon.weapon.bullets, this.altWeapon.weapon.bullets], this.game.map.colissionLayer, (bullet) => {
      this.weapon.killBullet(bullet, 'colissionLayer')
    })
  }

  bulletsCollideWithTank() {
    this.game.physics.arcade.overlap([this.weapon.weapon.bullets, this.altWeapon.weapon.bullets], this.app.player.tank, (player, bullet) => {
      var damage = null
        //process.env.NODE_ENV != 'production' && console.log('bullets tank', this.name, player.name, bullet)

      if (player.name == this.name) {
        return
      }

      if (this.robot) {
        damage = robotDamage
        this.app.socket.emit('robotDamage', this.name)
      }

      if (this.player) {
        damage = 'receivedDamage'
        this.app.socket.emit('receivedDamage', {
          uid: player.name,
          timestamp: Date.now()
        })
      }

      this.weapon.killBullet(bullet, damage)
    })
  }

  checkColissions() {
    this.collideWithEnemy = false
    this.colission = false

    if (!this.alive) {
      return false
    }

    this.tankColliedWithEnemy()
    this.tankCollideWithTopLayerGroup()
    this.tankCollideWithObsticalGroup()
    this.tankCollideWithMapColissionLayer()

    this.bulletsCollideWithObsticalGroup()
    this.bulletsCollideWithTopLayerGroup()
    this.bulletsCollideWithEnemyGroup()
    this.bulletsCollideWithMapColissionLayer()
    this.bulletsCollideWithTank()

  }
}