export default class {
  constructor(app) {
    this.app = app
  }

  show() {
    document.getElementById('loading').style.display = 'block'
    document.getElementById('playerStats').style.display = 'none'
    document.getElementById('gameModeChange').style.display = 'none'

    this.app.game.isLoading = true
  }

  hide() {
    document.getElementById('loading').style.display = 'none'
    document.getElementById('playerStats').style.display = 'block'
    this.app.game.isLoading = false
  }
}