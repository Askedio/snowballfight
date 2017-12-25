import {
  updateQueryStringParameter,
  getParameterByName
} from '../utils'

export default class {
  constructor(app) {
    this.app = app
    this.firstSpawn = true
    this.respawnDelay = 1
    this.disableRespawn = false
    this.screenElement = document.getElementById('spawnScreen')
    this.playerRoom = document.getElementById('playerRoom')
    this.playbutton = document.getElementById('playbutton')
    this.skinlist = document.getElementById('skinlist')




    document.getElementById('playerName').onkeypress = (e) => {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        if(!this.app.game.canPlay) {
          return
        }
        this.respawn()
        return false;
      }
    }

    document.getElementById('playerRoom').onkeypress = (e) => {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == '13'){
        if(!this.app.game.canPlay) {
          return
        }
        this.respawn()
        return false;
      }
    }

    document.getElementById('playbutton').onclick = (e) => {
        if(!this.app.game.canPlay) {
          return
        }
        this.respawn()
        return false;

    }


  }

  reset() {
    if (this.screenElement.style.display != 'block') {
      return
    }
    this.hide()
    this.show()
  }

  show(disableRespawnDelay) {
    setTimeout(() => {
      this.playbutton.focus()
    }, 100)

    this.screenElement.style.display = 'block'

    //  this.playbutton.addEventListener('mousedown', this.respawn.bind(this), true)
    this.skinlist.addEventListener('click', this.skinChange.bind(this), true)

    //this.app.state.data.gameMode

    document.getElementById('gameModeTitle').innerHTML = this.app.state.data.gameMode.headline.title
    document.getElementById('gameModeMessage').innerHTML = this.app.state.data.gameMode.headline.message

    if (
      (this.app.state.data.gameMode.limitedLives &&
        this.app.player.deaths == this.app.state.data.gameMode.limitedLives) ||
      (this.app.state.data.gameMode.disableSpawnWhenPlaying && this.app.game.canPlay && this.firstSpawn)
    ) {
      document.getElementById('playContainer').style.display = 'none'
    } else {
      document.getElementById('playContainer').style.display = 'block'
    }


    if (!this.firstSpawn && !disableRespawnDelay) {
      this.disableRespawn = true


      var count = this.app.player.respawnTime / 1000
      if (count) {
        this.playbutton.innerHTML = count
        var interval = setInterval(() => {
          --count
          if (count == 0) {
            this.disableRespawn = false
            this.playbutton.innerHTML = 'play'
            clearInterval(interval)
            return
          }
          this.playbutton.innerHTML = count
        }, 1000)
      } else {
        this.disableRespawn = false
        this.playbutton.innerHTML = 'play'
      }
    } else {
      this.playerRoom.value = getParameterByName('join')
    }

    this.firstSpawn = false
  }



  skinChange(e) {
    if (e.target && e.target.nodeName == "IMG") {
      var active = document.getElementsByClassName("active");
      active[0].className = ''
      this.app.player.loadSkin = e.target.id
      var newid = document.getElementById(e.target.id).parentElement
      newid.className = 'active';
    }
  }

  hide() {
    this.screenElement.style.display = 'none'
    this.clicked = false
  }

  respawn() {

    if (this.disableRespawn || !this.app.game.canPlay || this.clicked) {
      return
    }

    this.clicked = true

    //this.playbutton.removeEventListener('click', this.respawn)
    this.skinlist.removeEventListener('click', this.skinChange)

    updateQueryStringParameter('#', this.playerRoom.value)

    this.hide()

    this.app.player.spawn()

    process.env.NODE_ENV != 'production' && console.log('respawn clicked..')
  }
}