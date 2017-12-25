export default class {
  constructor(app, index, data) {
    //process.env.NODE_ENV != 'production' && console.log('trying to create obstical', index, data)
    this.app = app
    this.game = this.app.game

    this.index = index;
    this.destroyable = data.destroyable;
    this.type = data.type;
    this.blocking = data.blocking;
    this.bulletKills = data.bulletKills;
    this.killOnColission = data.killOnColission;
    this.killBulletOnColission = data.killBulletOnColission;
    this.usedSpawnTiles = this.game.map.usedSpawnTiles
    this.allSpawnTiles = this.game.map.allSpawnTiles
    this.bringToTop = data.bringToTop
    this.sounds = data.sounds || {}
    this.health = data.health
    this.explosionType = data.explosionType || 'default'
    this.alwaysPlay = data.alwaysPlay
    this.deadReason = data.deadReason
    this.playInView = data.playInView
    this.stopsPlayer = data.stopsPlayer

    this.createObject(data)

    //process.env.NODE_ENV != 'production' && console.log('creating obstical', index, data.x, data.y)



    this.game.physics.enable(this.object, Phaser.Physics.ARCADE);

    if(this.object.body) {
      this.object.body.immovable = !data.isMoveable;
    }

    if (data.isMoveable) {
      this.object.body.mass = data.object.body.mass;
      this.object.body.maxVelocity = data.object.body.maxVelocity;
      this.object.body.gravity = data.object.body.gravity;
    }

    if (data.tint) {
      this.object.tint = data.tint;
    }

    this.object.angle = data.angle;
    this.object.rotation = data.rotation;
    this.object.width = data.width;
    this.object.height = data.height;
    this.object.index = this.index;

    if (data.body) {
      this.object.body.setSize(data.body.width, data.body.height, data.body.x, data.body.y);
    }

    this.game.obsticalGroup.add(this.object)


    if (this.bringToTop) {
      this.game.topLayerGroup.add(this.object)
    }
  }

  createObject(data){
    if (data.tileSprite) {
      return this.object = this.game.add.tileSprite(data.x, data.y, data.width, data.height, data.sprite, data.frame)
    }

    if(data.textSprite) {
      this.object = this.game.add.text(data.x, data.y, data.sprite, data.fontSettings || {
        font: "24px Helvetica Neue",
        fill: "#000000",
        align: "left",
      })

      this.object.setText(data.textSprite)

      return
    }

    if (!data.sprite) {
      return
    }

    this.object = this.game.add.sprite(data.x, data.y, (data.sprite), data.frame);
  }

  update(data) {
    for (let d of Object.keys(data)) {
      this[d] = data[d]
    }
  }

  destroy() {
    if (!this.object) {
      return
    }

    this.object.destroy()
  }

  kill(data, reset) {
    //  process.env.NODE_ENV != 'production' && console.log('kill obstical', data, reset)


    if (!reset && data) {
      //console.log('kill sound', data, this)
      var _sound = this.sounds[data.deadReason]
      var _volume = .4
      var _distance = this.game.physics.arcade.distanceBetween(this.object, this.app.player.tank) / 100;

      if (_distance > 2) {
        _volume = .2
      }

      if (_distance > 3) {
        _volume = .1
      }

      if (_sound && (data.killer == this.app.player.name || this.alwaysPlay || (this.playInView && (_distance < 11 || this.object.inCamera)))) {
        var _audio = this.game.audio[_sound.sound]
        _audio.play(null, 0, _volume)
        if (_sound.pitch) {
          _audio._sound.playbackRate.value = _sound.pitch;
        }
      }


      if (this.destroyable && (data.killer == this.app.player.name || this.object.inCamera)) {
        this.game.explosions[this.explosionType].reset(this.object.centerX, this.object.centerY);
        this.game.explosions[this.explosionType].play('kaboom', 30, false, true);
      }
    }

    this.game.obsticalGroup.remove(this.object)


    if (this.bringToTop) {
      this.game.topLayerGroup.remove(this.object)
    }

    if (!this.object) {
      return
    }

    this.object.kill();

  }


  collide(player) {
    if (player.player) {
      this.app.socket.emit('obsticalCollide', this.index)
    }

    if (this.killOnColission) {
      return
    }

    if (player.robot) {
      player.weapon.fire()
    }
  }

  bulletHit(bullet, player) {
    if (player.player) {
      this.app.socket.emit('obsticalBulletHit', this.index)
    }

    if (this.killBulletOnColission) {
      return true
    }

    return false
  }
}