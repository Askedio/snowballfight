import Socket from './classes/Socket'
import Player from './classes/Player'
import Map from './classes/Map'
import Obstical from './classes/Obstical'
import Game from './classes/Game'
import SpawnScreen from './classes/SpawnScreen'
import LoadingScreen from './classes/LoadingScreen'
import State from './classes/State'

export class App {
  constructor() {
    process.env.NODE_ENV != 'production' && console.log('starting app..')

    this.socket = new Socket(this)
    this.spawnScreen = new SpawnScreen(this)
    this.loadingScreen = new LoadingScreen(this)

    this.game = new Game(this, this.socket)
  }

  toggleScoreBoard() {
    var div = document.getElementById('scoreBoard');
    div.style.display = div.style.display == "none" ? "block" : "none";
  }
}

window.app = new App