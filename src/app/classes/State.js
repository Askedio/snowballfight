import Player from '../classes/Player'
import Obstical from '../classes/Obstical'

export default class {
  constructor(app) {
    this.app = app
    this.game = app.game
    this.playerUpdates = document.getElementById('playerUpdates')
    this.playerChat = document.getElementById('chatBox')

    this.data = {
      world: {
        map: null,
        spawns: {}
      },
      players: {},
      obsticals: {},
      playerTotals: {
        alive: 0,
        total: 0
      },
      game: {
        mode: null,
        timed: false,
        timeLimit: 0,
        timeRemaining: 0,
      }
    }

    this.active = {
      players: {}
    }

    this.obsticals = {}

    this.snapshots = []
    this.lastTime = 0
    this.lastSnapshot = false
    this.playerUpdatesLength =0

    this.disableChat = false

    document.getElementById('chatSend').onkeypress = (e) => {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
          if(this.disableChat)  {
            return
          }
          this.disableChat = true
          this.app.socket.emit('chat', document.getElementById('chatSend').value)
          document.getElementById('chatSend').value = ''
          setTimeout(() => {
            this.disableChat = false
          }, 1000)
          return false;
        }
      }
  }

  domByID(id) {
    return document.getElementById(id)
  }


  updatePlayerStats(data) {
    this.data.playerTotals = data;

    this.domByID('score').innerHTML = this.app.player.score || 0
    this.domByID('kills').innerHTML = this.app.player.kills || 0
    this.domByID('deaths').innerHTML = this.app.player.deaths || 0
    this.domByID('health').innerHTML = this.app.player.health || 0

    this.domByID('redScore').innerHTML = data.teamScores.red || 0
    this.domByID('blueScore').innerHTML = data.teamScores.blue || 0

    this.showHideTeamMode()
    this.generateTopPlayerList(data)

  }

  showHideTeamMode() {
    var _display = document.getElementsByClassName('teamMode')[0].style.display
    if (this.app.state.data.gameMode.teamMode) {
      if(_display != 'block') document.getElementsByClassName('teamMode')[0].style.display = 'block'
    } else {
      if(_display != 'none') document.getElementsByClassName('teamMode')[0].style.display = 'none'
    }
  }

  generateTopPlayerList(data) {
    var newList = ''

    for (var player in data.topPlayers) {
      var plyr = this.active.players[data.topPlayers[player][0]]
      if(!plyr){continue}
      newList += '<li>'
      newList += '<div class="score">'
      newList += plyr.score || 0
      newList += '</div>'
      newList += '<div class="player ' + (this.app.state.data.gameMode.teamMode && plyr.team) + '">'
      if (typeof plyr.username != 'undefined') {
        newList +=  (!plyr.alive ? '💀' : '') +  ' ' + (plyr.username || 'unknown')
      }
      newList += '</div>'
      newList += '</li>'
    }

    this.domByID('scoreList').innerHTML = newList
  }




  hideAll(mode) {
    document.getElementById('gameModeChange').style.display = 'none'
    document.getElementById('pendingGameModeChange').style.display = 'none'
  }

  showMode(mode) {
    document.getElementById('gameModeChange').style.display = 'block'
    document.getElementById('pendingGameModeChange').style.display = 'block'
  }

  listenForUpdates() {
    process.env.NODE_ENV != 'production' && console.log('listening for socket updates...')

    this.app.socket.on('gameOver', (data) => {
      this.app.game.canPlay = false
      this.app.state.data.gameMode = data

      this.game.map.destroyLayers()
      this.game.map.createLayers()

      this.resetObsticals()
      this.hideAll()

      if (!this.game.ready || this.app.game.isLoading) {
        return
      }

      document.getElementById('gameModeTitle').innerHTML = this.app.state.data.gameMode.headline.title
      document.getElementById('gameModeMessage').innerHTML = this.app.state.data.gameMode.headline.message

    })

    this.app.socket.on('gameEnding', (data) => {
      if (!this.game.ready || this.app.game.isLoading) {
        return
      }

      document.getElementById('timeRemaining').innerHTML = data.timeLeft == 0  ?'now' :  'in ' + data.timeLeft
      this.showMode('pendingGameModeChange')
    })

    this.app.socket.on('gameStart', (data) => {
      this.app.game.canPlay = true
      this.app.spawnScreen.disableRespawn = false
      this.app.spawnScreen.reset()

      if (!this.game.ready || this.app.game.isLoading) {
        return
      }


    })

    this.app.socket.on('loadObsticals', (data) => {
      this.loadObsticals(data)
    })

    this.app.socket.on('spawnObsticals', (data) => {
      this.spawnObsticals(data)
    })

    this.app.socket.on('updateObsticals', (data) => {
      this.updateObsticals(data)
    })

    this.app.socket.on('killObsticals', (data) => {
      this.killObsticals(data)
    })

    this.app.socket.on('fullState', (data) => {
      this.snapshots = []
      this.app.state.default = data
      this.setup(data)
      process.env.NODE_ENV != 'production' && console.log('new state', data)
      this.fullState()
    })

    this.app.socket.on('snapshot', (snapshot) => {
      this.snapshots = this.snapshots.concat(require('jsonpack').unpack(snapshot))
    })
  }

  setup(data) {
    this.app.state.default = data
    this.app.state.data.world = data.world
    this.app.state.data.gameMode = data.game
    this.app.state.data.obsticals = data.obsticals
  }

  reset() {
    this.app.socket.io.removeAllListeners("loadObsticals")
    this.app.socket.io.removeAllListeners("spawnObsticals")
    this.app.socket.io.removeAllListeners("updateObsticals")
    this.app.socket.io.removeAllListeners("killObsticals")
    this.app.socket.io.removeAllListeners("gameOver")
    this.app.socket.io.removeAllListeners("gameEnding")
    this.app.socket.io.removeAllListeners("gameStart")
    this.app.socket.io.removeAllListeners("snapshot")
    this.app.socket.io.removeAllListeners("fullState")
  }

  resetObsticals(data) {
    this.killAllObsticals()
    this.obsticals = {}
  }

  killAllObsticals() {
    this.game.obsticalGroup.callAll('kill')
    this.game.topLayerGroup.callAll('kill')
  }

  loadObsticals(data) {
    process.env.NODE_ENV != 'production' && console.log('loading obsticals...', data)
    if (!data) {
      return
    }
    this.killAllObsticals()
    this.spawnObsticals(data)
  }

  spawnObsticals(data) {
    if (!data) {
      return
    }
    for (var d of Object.keys(data)) {
      this.obsticals[d] = new Obstical(this.app, d, data[d]);
    }
    this.game.world.bringToTop(this.game.topLayerGroup)
  }

  updateObsticals(data) {
    for (var d of Object.keys(data)) {
      if (!this.obsticals[d]) {
        continue
      }
      this.obsticals[d].update(data[d])
    }
    this.game.world.bringToTop(this.game.topLayerGroup)
  }

  killObsticals(data) {
    process.env.NODE_ENV != 'production' && console.log(data)

    for (let d of Object.keys(data)) {
      this.killObstical(d, data[d])
    }
  }

  killObstical(obstical, data) {
    if (!this.obsticals[obstical] || !this.obsticals[obstical].object) {
      return
    }
    this.obsticals[obstical].kill(data)
    delete this.obsticals[obstical]
  }

  getObstical(obstical) {
    return this.obsticals[obstical]
  }

  fullState() {
    this.app.state.loadObsticals(this.app.state.data.obsticals)

    for (var player in this.app.state.default.players) {
      var _player = this.app.state.active.players[player]
      var data = this.app.state.default.players[player]

      if (!this.app.state.active.players[player]) {
        _player = new Player(this.app, data.uid, data.alive, false, data.robot, data)
      }

      _player.updateState(data)
    }
  }

  removeRow(el, len) {
    len = len || 3
    var a  = el.getElementsByTagName('li')
    if (a.length >= len) {
      el.removeChild(a[0]);
    }
  }

  onUpdate() {
    if (this.snapshots.length > 3) {
      var snapshot = this.snapshots.shift()

      if (this.lastSnapshot && this.lastSnapshot.nextTick != snapshot.tick) {
        process.env.NODE_ENV != 'production' && console.log('i missed a tick, so im not synced, request fullState')
        this.app.socket.io.emit('fullState')
        this.snapshots = []
      }

      if (snapshot.playersnap) {
        for (var player in snapshot.playersnap) {
          var data = snapshot.playersnap[player]
          var _player = this.active.players[player]

          if (!_player && data) {
            if (!data.newPlayer) {
              process.env.NODE_ENV != 'production' && console.log('player update that doesnt exist, need full update')
              this.app.socket.io.emit('fullState')
              continue
            }

            _player = new Player(this.app, data.uid, data.alive, false, data.robot, data)
          }

          _player.updateState(data)
        }
    }

      if(snapshot.playerUpdates) {
        for(var update of snapshot.playerUpdates) {
          this.removeRow(this.playerUpdates)
          this.lastAdded = Date.now()
          this.playerUpdates.innerHTML += '<li>'+ update + '</li>'
        }
      }

      if(snapshot.playerChats) {
        for(var update of snapshot.playerChats) {
          this.removeRow(this.playerChat)
          this.lastAdded0 = Date.now()
          this.playerChat.innerHTML += '<li>'+ update + '</li>'
        }
      }

      if(this.lastAdded && Date.now() - this.lastAdded >= 3000) {
        this.removeRow(this.playerUpdates, 1)
      }
      if(this.lastAdded0 && Date.now() - this.lastAdded0 >= 3000) {
        this.removeRow(this.playerChat, 1)
      }



      if (snapshot.removeUsers) {
        for (var player of snapshot.removeUsers) {
          if (this.active.players[player]) {
            this.active.players[player].destroy()
          }
        }
      }

      if (snapshot.stats && Object.keys(snapshot.stats).length) {
        this.updatePlayerStats(snapshot.stats)
      }

      if (snapshot.obsticals && snapshot.obsticals.dead && Object.keys(snapshot.obsticals.dead).length) {
        this.killObsticals(snapshot.obsticals.dead)
      }

      if (snapshot.obsticals && snapshot.obsticals.update && Object.keys(snapshot.obsticals.update).length) {
        this.updateObsticals(snapshot.obsticals.update)
      }

      //if (Object.keys(snapshot.obsticals.respawn).length) {
      //    this.cals(snapshot.obsticals.respawn)
      //  }

      for (var move in snapshot.moves) {
        var data = snapshot.moves[move]
        var player = this.active.players[data.uid]

        if (!player) {
          continue
        }

        player.newMove(data)
        player.speed = data.speed // ?
      }
    }

    this.lastSnapshot = snapshot

    if (this.snapshots.length > 30) {
      process.env.NODE_ENV != 'production' && console.log('im to laggy, need a new state')
      //this.app.socket.io.emit('fullState')
    }

    for (let _player in this.app.state.active.players) {
      this.active.players[_player].update()
    }
  }
}