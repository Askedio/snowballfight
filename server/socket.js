"use strict";

const SOCKET_PORT = 8099
const WEB_PORT = 3000
const express = require('express')
const colors = require('colors');
const RoomState = require('./rooms')
const clean = require('./utils').clean
const app = express()
const io = require('socket.io')(SOCKET_PORT);

app.get('/', function (req, res) {
  res.send(RoomState.total() + 'room ' + RoomState.totalClients() + 'clients')
})

app.listen(WEB_PORT);
console.log('Web server started on port:'.green, WEB_PORT);

console.log('Socket server started on port:'.green, SOCKET_PORT);
io.on('connection', (socket) => {
  var _player = new(require('./players/base'))(socket.id)
  var _room, _timers = {}

  console.log('- new connection:'.green, socket.id)

  function getTeamModeRoom() {
    var _room = RoomState.get(_player.room)

    if (!_room.state.game.teamMode) {
      return false
    }

    return _room
  }

  _player.on('revive', () => {
    var _room = getTeamModeRoom()
    if (!_room) {
      return
    }

    _room.state.joinTeam(_player)
  })

  _player.on('killedPlayer', () => {
    var _room = getTeamModeRoom()
    if (!_room) {
      return
    }

    _room.state.teamScore(_player, 'killedPlayer')
  })

  _player.on('killedObstical', () => {
    var _room = getTeamModeRoom()
    if (!_room) {
      return
    }

    _room.state.teamScore(_player, 'killedObstical')
  })

  function clearTimers() {
    for (var timer of Object.keys(_timers)) {
      clearTimeout(_timers[timer])
    }
    _player.resets = []
    _timers = {}
  }

  _player.on('dead', () => {
    var _room = RoomState.get(_player.room)

// move this to player the other player
    var killer = '', weapon = false, results = '💀 <i>' + (_player.username || 'unknown') + '</i>'
    if (_player.killer == 'sucide'){
      results += ' committed suicide 💩'
    } else if(_player.killer &&  _room.state.players[_player.killer]) {
      killer =  _room.state.players[_player.killer].username
      weapon = _player.killerWeapon

      results += ' killed by <strong>'+ killer + '</strong>'

      if(weapon) {
        results += ' with 🔫 ' +  weapon
      }
    } else (
      results += ' died'
    )


    if(results) {
      _room.state.playerUpdates.push(results)
    }

    clearTimers()
  })

  _player.on('resetTimer', (data) => {
    clearTimeout(_timers[data])
    _player.resets.splice(data, 1)
    delete _timers[data]
  })

  _player.on('flagReset', (flag) => {
    var _room = RoomState.get(_player.room)
    _room.state.resetFlag(flag)
  })

  _player.on('setSpawnPosition', () => {
    var _room = RoomState.get(_player.room)
    _room.state.setSpawnPosition(_player)
  })

  _player.on('resetPlayerSetting', (data) => {
    _timers[data.reset] = setTimeout(() => {
      if (!data.reset in _player.resets) {
        return
      }

      Object.assign(_player, data.settings)

      _player.resets.splice(data.reset, 1)
      delete _timers[data.reset]
    }, data.delay)
  })


  function fullState() {
    return {
      uid: _player.uid,
      world: clean(_room.state.world),
      game: clean(_room.state.game),
      obsticals: clean(_room.state.obsticals.live),
      player: clean(_player),
      players: clean(_room.state.players)
    }
  }

  function joinRoom(room, newroom) {
    room = room || 'default'
    RoomState.join(_player, room)

    _room = RoomState.get(_player.room)

    socket.join(_player.room)
    console.log('- new room:'.green, socket.id, _player.room)

    var _results = fullState()

    if (newroom) {
      _results['newroom'] = _player.room
    }

    socket.emit('connected', _results)
  }

  joinRoom(socket.handshake.query['room'])

  socket
    .on('disconnect', () => {
      RoomState.leave(_player)
      clearTimers()
      _player = null
    })
    .on('fullState', (data) => {
      socket.emit('fullState', fullState())
    })
    .on('move', (data) => {
      _room.state.onMove(_player, data)
    })
    .on('chat', (data) => {
      _room.state.onChat(_player, data)
    })
    .on('revive', (data) => {
      if (data.room && data.room != _player.room) {
        socket.leave(_player.room)
        console.log('- player left room'.red, socket.id, _player.room)

        RoomState.leave(_player)
        joinRoom(data.room, true)

        _player.reset()
        _player.setUsernameAndSkin(data)

        return
      }
      _player.onRevive(data)

      var _room = RoomState.get(_player.room)
      _room.state.playerUpdates.push( '<i>'+_player.username + '</i> is <span class="green">alive</span> 😏')
    })
    .on('suicide', () => {
      _player.onSuicide()
    })
    .on('robotDamage', (data) => {
      _player.onRobotDamage(data)
    })
    .on('obsticalCollide', (data) => {
      _player.onObsticalCollide(data)
    })
    .on('obsticalBulletHit', (data) => {
      _player.onBulletHit(data)
    })
    .on('damagedEnemy', (data) => {
      _player.onDamagedEnemy(data)
    })
    .on('receivedDamage', (data) => {
      _player.onDamaged(data)
    })
    .on('fire', (data) => {
      _player.onFire(data)
    })
})

module.exports.io = io
module.exports.RoomState = RoomState;