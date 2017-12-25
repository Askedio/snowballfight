"use strict";

var generateName = require('sillyname');
var io = require('./socket').io
var JSONC = require('jsoncomp')

class State extends require('./stateFunctions') {

  destroy() {
    for (var interval in this.intervalTimers) {
      clearTimeout(this.intervalTimers[interval])
    }
  }

  getGameModeFromEmoji(emoji) {
    // compare two arrays instead
    if(this.room == '💀') {
      return 'suddendeath'
    }

    if(this.room == '🎌') {
      return 'ctf'
    }

    if(this.room == '👥') {
      return 'tdm'
    }

    if(this.room == '🎄') {
      return 'treeland'
    }

    return false
  }

  roomFromEmoji() {

    var _emojiRoom = this.room.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
    if(_emojiRoom) {
      var _gameModes = [];
      for(var emoji of _emojiRoom) {
        if(!emoji || _gameModes.length > 10) {
          continue
        }
        var _mode = this.getGameModeFromEmoji(emoji)
        if(!_mode) {
          continue
        }



        _gameModes.push(_mode)
      }

      if(_gameModes.length){
        this.gameModes = _gameModes
      }
    }
  }

  constructor(room, loadWorld, gameMode) {
    super()
    this.world = require('./worlds').get(loadWorld || 'winter')
    this.room = room || 'default'

    this.gameModes = this.world.gameModes
    this.roomFromEmoji()

    this.gameMode = gameMode || this.gameModes[0]
    this.nextMode = null
    this.maxBots = 0
    this.allowedBotsPerPlayer = 0
    this.players = {}
    this.connected = {}
    this.bots = 0
    this.gameOver = false
    this.objectTimers = []
    this.intervalTimers = []
    this.snapshot = []
    this.playerMoves = []
    this.setGameMode()
    this.lastSnap = false
    this.removeUsers = []
    this.tick = 0
    this.playerStats = {}
    this.playerUpdates = []
    this.playerChats = []


    this.intervalTimers.push(setInterval(() => {
      if (this.game.timed) {
        if (this.game.timeRemaining > 0) {
          this.game.timeRemaining -= 1000

          if (this.game.timeRemaining <= this.game.respawn) {
            io.sockets.to(room).emit('gameEnding', {
              timeLeft: this.game.timeRemaining / 1000,
              respawn: this.game.respawn / 1000,
              nextMode: this.nextMode
            })
          }
          return
        }

        if (this.game.timeRemaining == -1) {
          return
        }

        io.sockets.to(this.room).emit('gameOver', this.nextMode)
        this.gameOver = true
        this.game.timeRemaining = -1;

        for (var timer in this.objectTimers) {
          clearTimeout(this.objectTimers[timer])
        }

        this.setGameMode(true)

        setTimeout(() => {
          this.game.timeRemaining = this.game.timeLimit
          io.sockets.to(this.room).emit('gameStart')
          this.gameOver = false
        }, this.game.respawnDelay);


        for (var player in this.players) {
          var _player = this.players[player]
          if (this.game.resetPlayersOnEnd) {
            this.game.resetPlayersOnEnd(_player)
          } else {
            _player.reset()
          }
        }

        this.obsticals = {
          all: this.game.obsticals,
          live: this.game.obsticals,
          dead: {},
          respawn: {},
          update: {}
        }

        io.sockets.to(this.room).emit('loadObsticals', this.obsticals.all)
      }
    }, 1000))







    // send snapshot to clients 50ms
    this.intervalTimers.push(setInterval(() => {
      if (!this.snapshot.length) {
        return
      }

      var data = require('jsonpack').pack(JSON.stringify(this.snapshot))
      io.sockets.to(this.room).emit('snapshot', data)

      //console.log('sent:', getBinarySize(data))
      this.snapshot = []
    }, 20))


    this.intervalTimers.push(setInterval(() => {
        // During each tick, the server processes incoming user commands, runs a physical simulation step, checks the game rules, and updates all object states.
        // -- user commads are sent to a queued list and processed here, same as we do with obsticals
        // -- user movement doesnt need long interval, tick is 15, rate is 50m so .. 50?

        // After simulating a tick, the server decides if any client needs a world update and takes a snapshot of the current world state if necessary


        this.processObsticals()

        var players = {},
          lastSnap = this.lastPlayers ? JSON.parse(this.lastPlayers) : {};


        for (var player in this.players) {
          if (!lastSnap[player]) {
            players[player] = this.players[player]
            continue
          }

          var _diff = require('./utils').diff(lastSnap[player], this.players[player])
          if (!Object.keys(_diff).length) {
            continue
          }

          players[player] = _diff
        }

        var nextTick = this.tick + 1
        if (nextTick == 99) {
          nextTick = 0
        }

        var snapshot = {
          tick: this.tick,
          nextTick: nextTick,
          timestamp: Date.now(),
        }


        var add = false

        if(this.playerChats.length) {
          snapshot['playerChats'] = this.playerChats
          add = true
        }

        if(this.playerUpdates.length) {
          snapshot['playerUpdates'] = this.playerUpdates
          add = true
        }

        if (Object.keys(this.obsticals.dead).length) {
          if (!snapshot['obsticals']) {
            snapshot['obsticals'] = {}
          }
          snapshot['obsticals']['dead'] = this.obsticals.dead
          add = true
        }

        if (Object.keys(this.obsticals.update).length) {
          if (!snapshot['obsticals']) {
            snapshot['obsticals'] = {}
          }
          snapshot['obsticals']['update'] = this.obsticals.update
          add = true
        }

        if (this.playerMoves.length) {
          snapshot['moves'] = this.playerMoves
          add = true
        }

        if (Object.keys(this.playerStats).length) {
          snapshot['stats'] = this.playerStats
          add = true
        }

        if (Object.keys(players).length) {
          snapshot['playersnap'] = players
          add = true
        }

        if (this.removeUsers.length) {
          snapshot['removeUsers'] = this.removeUsers
          this.removeUsers = []
          add = true
        }

        this.lastPlayers = JSON.stringify(this.players)

        if (add) {
          this.tick++;

          if (this.tick == 99) {
            this.tick = 0
          }

          this.snapshot.push(snapshot)
        }

        this.afterSnapshot()

      }, 15)) // should be the 15..




    this.intervalTimers.push(setInterval(() => {
      var alive = 0;
      var alivePlayers = 0;
      var bots = alivePlayers
      var botsPerPlayer = this.allowedBotsPerPlayer

      for (var player in this.players) {
        if (this.players[player]['alive']) {
          alive++;

          this.calculateScores(player)

          if (!this.players[player]['robot']) {
            alivePlayers++

            if (!this.players[player]['hasRobots'].length && this.players[player].alive) {

              for (var i = 0; i < botsPerPlayer; i++) {
                if (this.bots >= this.maxBots) {
                  continue
                }

                var bots = alivePlayers * botsPerPlayer

                if (this.bots < bots) {
                  var name = generateName().toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").substring(0, 18)

                  this.players[name] = new(require('./players/robot'))(name, room)
                  this.players[name]['alive'] = true
                  this.players[name]['owner'] = player
                  this.bots++;

                  this.players[player]['hasRobots'].push(name)
                }
              }
            }
          }
        }

        if (this.players[player]['robot']) {
          if (!this.players[this.players[player].owner] || !this.players[this.players[player].owner].alive) {
            this.players[player].owner = null
            var newplayer = randomProperty(this.connected);
            if (newplayer && !newplayer.robot) {
              this.players[player].owner = newplayer.uid
              this.players[newplayer.uid].hasRobots.push(player)
              return
            }
          }

          if (!this.players[player].alive && !this.players[player]['pendingRespawn']) {
            this.players[player]['pendingRespawn'] = true
            if (this.players[player].respawnTime) {
              setTimeout((player) => {
                player.alive = true
                player.pendingRespawn = false
              }, this.players[player].respawnTime, this.players[player])
            }
          }

          if (this.players[player].alive) {
            var bots = (Object.keys(this.players).length - this.bots) * botsPerPlayer
            if (this.bots > bots) {
              this.deletePlayer(this.players[player].uid)
              this.bots--
            }
          }
          continue
        }

        if (!io.sockets.sockets[player] && !this.players[player]['robot']) {
          delete this.players[player]
          delete this.connected[player]
          continue
        }
      }

      var topPlayers = []
      for (var player in this.players) {
        topPlayers.push([player, this.players[player].score] )
      }

      topPlayers.sort(function(a, b) {
        return b[1] - a[1]
      })


      this.playerStats = {
        total: Object.keys(this.players).length,
        alive: alive,
        topPlayers: topPlayers.slice(0, 9),
        teamScores: this.teamScores,
        teams: this.teams
      }

      if (this.gameOver) {
        return
      }

      if (Object.keys(this.obsticals.respawn).length) {
        io.sockets.to(room).emit('spawnObsticals', this.obsticals.respawn);
        Object.assign(this.obsticals.live, this.obsticals.respawn)
        this.obsticals.respawn = {}
      }
    }, 100))


    this.intervalTimers.push(setInterval(() => {
      console.log('-', this.room, Object.keys(this.players).length, this.gameMode, this.nextMode.mode)
    }, 1000))
  }

  afterSnapshot() {
    for (var player in this.players) {
      this.players[player].newPosition = null
      this.players[player].removeSprites = []
    }


    this.playerMoves = []
    this.playerStats = {}
    this.obsticals.update = {}
    this.obsticals.dead = {}
    this.playerUpdates = []
    this.playerChats = []
  }

  processObsticals() {
    if (Object.keys(this.obsticals.dead).length) {
      for (var data of Object.keys(this.obsticals.dead)) {
        var obstical = this.obsticals.dead[data]
        if (obstical.respawn) {
          if (Number.isInteger(obstical.respawn)) {
            this.objectTimers.push(setTimeout((data, obstical) => {
              data = obstical
            }, obstical.respawn, this.obsticals.respawn[data], obstical));

            continue;
          }

          if (typeof obstical.respawn === 'function') {
            this.objectTimers.push(obstical.respawn())
            continue;
          }

          this.obsticals.respawn[data] = obstical
        } else {
          this.obsticals.all[data] = obstical
        }
      }
    }
  }

  onMove(player, move) {
    if (!move) {
      return
    }
    var moves = require('jsonpack').unpack(move)
    this.playerMoves.push(...moves);
  }

  onChat(player, data) {
    this.playerChats.push('<i>' + (player.username || 'unknown') + '</i>: ' + data.replace(/[^a-zA-Z0-9:\(\)\uD83C-\uDBFF\uDC00-\uDFFF]+/g, " ").substring(0, 32))
  }
}

var globalClients = 0;



function getBinarySize(string) {
  return Buffer.byteLength(string, 'utf8');
}

module.exports = State



/*
setInterval(function () {
  world = worlds['sand'];

  state.obsticals.all = obsticals[world.map];
  state.obsticals.live = state.obsticals.all;

  io.sockets.to(room).emit('loadWorld', {
    world: world,
    obsticals: state.obsticals.live
  });
}, 12000);
*/