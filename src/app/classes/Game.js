import PreloadState from '../states/PreloadState'
import MapState from '../states/MapState'
import SocketState from '../states/SocketState'
import ReadyState from '../states/ReadyState'

import {
  windowWidth,
  windowHeight
} from '../utils'

export default class extends Phaser.Game {
  constructor(app, socket) {
    super(windowWidth, windowHeight, Phaser.CANVAS, 'content', null)

    this.app = app
    this.socket = socket
    this.loaded = false
    this.ready = false

    this.canPlay = true

    this.state.add('PreloadState', PreloadState)
    this.state.add('SocketState', SocketState)
    this.state.add('MapState', MapState)
    this.state.add('ReadyState', ReadyState)

    this.state.start('PreloadState')



    var noop = () => {
      if (!this.app.player) {
        return
      }
      //  this.app.player.suicide()
    };

    this.onBlur = noop;
    this.onFocus = noop;
    this.onPause = noop;
    this.onResume = noop;
    this.focusLoss = noop;
    this.focusGain = noop;


  }

}