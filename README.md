# HTML5 Multiplayer Snowball Fighting Game
A html5 javascript phaser.io socket.io multiplayer game.

# Demo
http://snowballfight.asked.io

# Install
```
npm install
```

# Run
``` 
npm run server
npm run serve
```

Play at http://localhost:9999

# Rooms
```
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
```

# Emojis
Use emjois all over, it was 2016 when I wrote this.

# Issues
It's laggy. Locally not to bad, on a server it gets worse. I tried to implement the valve style multiplayer system, but failed. I lost interest after multiple attempts. I did find ColyseusJS and some other tools to help with timeline but winter was already over.

