import Player from '../classes/Player'
import Explosions from '../classes/Explosions'

export default class extends Phaser.State {
  init() {
    process.env.NODE_ENV != 'production' && console.log('starting ready state..')
    this.app = this.game.app
  }

  preload() {
    this.game.time.advancedTiming = true;
  }

  create() {
    this.game.map.create()


    //this.game.foota = this.game.add.audio('foota');
    this.game.audio = {
      bullet1: this.game.add.audio('bullet1'),
      bullet2: this.game.add.audio('bullet2'),
      bullet3: this.game.add.audio('bullet3'),
      bullet4: this.game.add.audio('bullet4'),
      bullet5: this.game.add.audio('bullet5'),
      explosion: this.game.add.audio('explosion'),
      chime1: this.game.add.audio('chime1'),
      chime2: this.game.add.audio('chime2'),
      chime3: this.game.add.audio('chime3'),
      laugh1: this.game.add.audio('laugh1'),
      shoot1: this.game.add.audio('shoot1'),
      move1: this.game.add.audio('move1'),
      smash1: this.game.add.audio('smash1'),
      smash2: this.game.add.audio('smash2'),
      smash3: this.game.add.audio('smash3'),
      smash4: this.game.add.audio('smash4'),
    }


    if (this.app.player) {
      process.env.NODE_ENV != 'production' && console.log('player exists, removing')

      this.app.player.destroy()
      this.app.player = null
    }

    new Explosions(this.game)
    process.env.NODE_ENV != 'production' && console.log('game ready..')
    this.game.ready = true

    this.app.player = new Player(this.app, this.app.socket.uid, false, true, false, this.app.defaultPlayerData)
      //this.app.player.updateState(this.app.defaultPlayerData)

    // create player


    this.app.state.listenForUpdates()
    this.app.state.fullState()


    this.app.loadingScreen.hide()

    if (this.game.newroom) {
      this.app.player.spawn()
      return
    }


    this.game.camera.x = this.game.width / 2;
    this.game.camera.y = this.game.height / 2;

    this.app.game.canPlay = true

    this.app.spawnScreen.show()


  }

  update() {
    this.app.state.onUpdate()

    if(!this.app.player.tank) {
      return
    }
    this.game.world.bringToTop(this.game.obsticalGroup)
    this.game.world.bringToTop(this.game.enemyGroup)
    this.game.world.bringToTop(this.app.player.group)
    this.game.world.bringToTop(this.app.player.tank)
    this.game.world.bringToTop(this.game.topLayerGroup)

  }

  render() {
    return
    this.game.debug.text(this.game.time.fps + 'fps' || '--', 2, 14, "#00ff00");
    for (var obstical of Object.keys(this.app.state.obsticals)) {
      this.game.debug.body(this.app.state.obsticals[obstical].object);
    }
    this.game.debug.body(this.app.player.tank);
  }
}