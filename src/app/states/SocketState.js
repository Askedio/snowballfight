
export default class extends Phaser.State {
  init() {
    process.env.NODE_ENV != 'production' && console.log('starting socket state..')

    if (this.game.socket.connected) {
      this.ready()
    }

    this.game.socket.connect().on('connected', (data) => {
      this.game.newroom = data.newroom
      this.ready()
    })
  }

  ready() {
    this.game.state.start('MapState')
  }

}