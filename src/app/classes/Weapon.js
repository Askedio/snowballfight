export default class {
  constructor(app, player) {
    this.app = app
    this.game = this.app.game
    this.player = player
    
    this.weapon = this.game.add.weapon(0, '')
    this.shootSound = this.game.audio.shoot1
    this.explosion = this.game.explosiongrey

    this.settings = {
      speed: 0,
      total: 0,
      fireRate: 0,
      sprite: null,
      bulletSpeedVariance: 0,
      fireRateVariance: 0,
      bulletLifespan: 0
    }
  }

  reset() {
    this.createBullets()
  }

  destroy() {

  }

  canFire() {
    if (!this.player.alive || !this.player.moveable) {
      return false
    }

    return true
  }

  altFire() {
    this.fire(true)
  }

  // fire and bulets to weapon class..
  fire(alt) {
    if (!this.canFire()) {
      return
    }
    this.alt = alt

    this.shootBullet()
  }

  shootBullet() {
    this.weapon.bullets.setAll('name', this.alt ? 'alt' : 'reg')
    this.weapon.bullets.uid = Date.now()
    this.weapon.bullets.setAll('uid', Date.now())

    this.weapon.fire()

    return true;
  }

  killBullet(bullet, soundType, disablePlayBulletKillSound) {
    if (!disablePlayBulletKillSound) {
      this.playSound(soundType, bullet)
    }

    bullet.kill();
  }

  playSound(type, bullet) {
    if (!bullet.isPlayer && !bullet.inCamera) {
      return
    }
    //obsticalKill
    if (this.robot) {
      if (type == 'robotDamage') {
        if (!this.game.audio.bullet3.isPlaying) {
          this.game.audio.bullet3.play(null, 0, .1)
          return
        }
        return
      }
    }

    if (type == 'colissionLayer') {
      if (!this.game.audio.bullet4.isPlaying) {
        this.game.audio.bullet4.play(null, 0, .1)
        return
      }
      return
    }

    if (type == 'colissionLayer') {
      return
    }

    if (type == 'robotDamage') {
      //return
    }

    if (!this.game.audio.bullet2.isPlaying) {
      this.game.audio.bullet2.play(null, 0, .1)
      return
    }

    if (!this.game.audio.bullet5.isPlaying) {
      this.game.audio.bullet5.play(null, 0, .1)
      return
    }
  }

  explodeBullet(bullet) {
    this.explosion.reset(bullet.x, bullet.y)
    this.explosion.revive()

    var animation = this.explosion.animations.play('kaboom', 30)
    animation.onComplete.add(() => {
      this.explosion.kill()
    })
  }

  createBullets() {
    this.weapon.destroy()
    this.weapon = this.game.add.weapon(this.settings.total, this.settings.sprite);

    this.weapon.bringToTop
    this.weapon.bulletSpeed = this.settings.speed;
    this.weapon.fireRate = this.settings.fireRate;
    this.weapon.fireRateVariance = this.settings.fireRateVariance;
    this.weapon.bulletSpeedVariance = this.settings.bulletSpeedVariance;
    this.weapon.bulletLifespan = this.settings.bulletLifespan;
    this.weapon.bulletAngleOffset = this.settings.bulletAngleOffset;
    this.weapon.bulletAngleVariance = this.settings.bulletAngleVariance;

    this.weapon.onKill.add((bullet) => {
      this.explodeBullet(bullet)
    })

    this.weapon.onFire.add((bullet, weapon) => {
      this.app.socket.emit('fire', {
        x: weapon.x,
        y: weapon.y,
        type: bullet.name,
        timestamp: Date.now()
      })

      bullet.player = this.player.name
      bullet.isPlayer = this.player.player

      if (!this.shootSound.isPlaying && (this.player.player || this.player.tank.inCamera)) {
        // if player or remote within range
        var shootSound = this.shootSound.play(null, 0, .1)
        shootSound._sound.playbackRate.value = 3
      }
    })

    this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    this.weapon.trackSprite(this.player.tank, 22, 0);
    this.weapon.trackRotation = true
    this.weapon.bullets.setAll('name', this.alt ? 'alt' : 'reg')
    this.weapon.bullets.setAll('uid', this.player.uid)
    this.weapon.bulletInheritSpriteSpeed = true;
  }
}