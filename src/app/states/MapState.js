import {
  windowWidth,
  windowHeight
} from '../utils'
import Map from '../classes/Map'

export default class extends Phaser.State {
  init() {
    this.app = this.game.app
  }

  preload() {
    process.env.NODE_ENV != 'production' && console.log('starting map state..')

    this.app.spawnScreen.hide()
    this.app.loadingScreen.show()
  }

  create() {
    if (this.game.map) {
      this.game.map.destroy()
    }

    this.game.map = new Map(this.app)
  }

  render() {
    this.game.state.start('ReadyState')
  }
}