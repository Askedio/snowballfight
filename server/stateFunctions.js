"use strict";


class StateFunctions {
  setNextGameMode() {
    var _position = this.gameModes.indexOf(this.gameMode)
    var _mode = _position == this.gameModes.length - 1 ?
      this.gameModes[0] :
      this.gameModes[_position + 1]
    this.nextMode = new(require('./gamemodes/' + _mode + '.js'))(this.world.map)
  }

  resetFlag(flag) {
    if (!this.obsticals.all[flag]) {
      return
    }
    this.obsticals.all[flag].sendToRespawnState()
  }

  setSpawnPosition(player) {
    console.log('set position')
    var spawn = this.game.obsticalGroup.spawnTiles.setLayer('spawns').getRandomTile(this.game.getSpawnTileType(player), true)
    if (!spawn || !spawn.x || !spawn.y) {
      spawn = {
        x: 1200,
        y: 900
      }
    }

    player.newPosition = spawn



  }

  calculateScores(player) {
    if (!this.gameOver) {
      if (this.game.scoring == 'combo') {
        this.players[player]['score'] = Math.round(((this.players[player]['kills'] || 1) * this.players[player]['objectsKilled']) / (this.players[player]['deaths'] || 1))
      }

      if (this.game.scoring == 'kills') {
        this.players[player]['score'] = this.players[player]['kills']
      }

      if (this.game.scoring == 'simple') {
        this.players[player]['score'] = this.players[player]['objectsKilled']
      }

      if (this.game.scoring == 'flags') {
        this.players[player]['score'] = this.players[player]['hits']['flagCaps']
      }
    }
  }

  setGameMode(next) {
    if (next) {
      console.log('game changed')
      this.lastMode = this.game
      this.game = this.nextMode
      this.gameMode = this.game.mode
    } else {
      this.game = new(require('./gamemodes/' + this.gameMode + '.js'))(this.world.map)
    }

    this.game.on('obsticalRespawn', (data) => {
      this.obsticals.respawn[data.name] = data
    })

    this.game.on('obsticalKill', (data) => {
      var _obstical = this.obsticals.all[data.name]
      if (!_obstical) {
        return
      }

      delete this.obsticals.live[data.name]
      this.obsticals.dead[data.name] = _obstical
    })


    this.game.on('flagCapture', (player) => {
      if(!player || !player.hasFlag || !this.obsticals.all[player.hasFlag]) {
        return
      }

      this.obsticals.all[player.hasFlag].sendToRespawnState()
      player.removeSprites.push(player.hasFlag)
      delete player.addSprite[player.hasFlag]
      player.hasFlag = false
      player.hits.flagCaps += 1

      this.playerUpdates.push( '<i>' + player.username + '</i> captured the ' + player.team + ' 🏁')

      if (this.game.teamMode && this.game.teamScoreMode == 'ctf') {
        this.teamScore(player, 'killedObstical')
      }
    })

    this.maxBots = this.game.maxBots
    this.allowedBotsPerPlayer = this.game.allowedBotsPerPlayer

    this.setNextGameMode()

    this.obsticals = {
      all: this.game.obsticals,
      live: this.game.obsticals,
      dead: {},
      respawn: {},
      update: {}
    }

    this.teams = {
      red: {},
      blue: {}
    }

    this.teamScores = {
      red: 0,
      blue: 0
    }
  }


  joinTeam(player) {
    if (player.team) {
      this.leaveTeam(player, player.team)
    }

    var _reds = Object.keys(this.teams.red).length
    var _blues = Object.keys(this.teams.blue).length

    if (_blues > _reds) {
      return this.setPlayerTeam(player, 'red')
    }

    if (_reds > _blues) {
      return this.setPlayerTeam(player, 'blue')
    }

    this.setPlayerTeam(player, 'red') //should be random
  }

  setPlayerTeam(player, team) {
    player.team = team

    this.teams[team][player.uid] = player

    if (player.team == 'blue') {
      player.skin = 'playerd'
    }

    if (player.team == 'red') {
      player.skin = 'playera'
    }
  }

  leaveTeam(player, team) {
    if (this.teams[team] && this.teams[team][player.uid]) {
      delete this.teams[team][player.uid]
    }
  }

  teamScore(player, score) {
    if (this.game.teamScoreMode == 'kills' && score == 'killedPlayer') {
      this.teamScores[player.team]++;
      return
    }

    if (this.game.teamScoreMode == 'obsticals' && score == 'killedObstical') {
      this.teamScores[player.team]++;
      return
    }


    if (this.game.teamScoreMode == 'ctf' && score == 'killedObstical') {
      this.teamScores[player.team]++;
      return
    }
  }

  deletePlayer(player) {
    if (player.team) {
      delete this.teams[player.team]
    }
    if (this.players[player]) {
      delete this.players[player]
    }
    if (this.connected[player]) {
      delete this.connected[player]
    }
  }
}

module.exports = StateFunctions