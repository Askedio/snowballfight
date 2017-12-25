export default class {

  constructor(game) {
    this.game = game

    this.game.explosion = this.game.add.sprite(0, 0, 'kaboom')
    this.game.explosion.kill()
    this.game.explosion.anchor.set(0.5)
    this.game.explosion.animations.add('kaboom')

    this.game.explosiongrey = this.game.add.sprite(0, 0, 'explosiongrey')
    this.game.explosiongrey.kill()
    this.game.explosiongrey.scale.setTo(.15, .15)
    this.game.explosiongrey.anchor.set(0.5)
    this.game.explosiongrey.animations.add('kaboom')

    this.game.explosiongreybig = this.game.add.sprite(0, 0, 'explosiongrey')
    this.game.explosiongreybig.kill()
    this.game.explosiongreybig.scale.setTo(.6, .6)
    this.game.explosiongreybig.anchor.set(0.5)
    this.game.explosiongreybig.animations.add('kaboom')

    this.game.explosion2 = this.game.add.sprite(0, 0, 'explosion2')
    this.game.explosion2.kill()
    this.game.explosion2.scale.setTo(.6, .6)
    this.game.explosion2.anchor.set(0.5)
    this.game.explosion2.animations.add('kaboom')

    this.game.explosions = {
      default: this.game.explosion,
      greysm: this.game.explosiongrey,
      grey: this.game.explosiongreybig,
      alt: this.game.explosion2
    }
  }

}