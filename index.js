require('dotenv-safe').config()
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const initMongo = require('./config/mongo')

const faker = require('faker')

const Room = require('./app/models/room')
const Chat = require('./app/models/chat')


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/group', (req, res) => {
  res.sendFile(__dirname + '/group.html');
});

io.on('connection', (socket) => {

  socket.on("room join", async room_id => {

    socket.join(room_id);
    io.to(room_id).emit('room join', room_id);
  })

  socket.on('chat message', async msg => {
    console.log("Chat message",msg);
    if(msg.room_type === "individual"){

      const added = await Chat.create({
        room_id : msg.room_id,
        message : msg.message,
        primary_room_id : msg.primary_room_id,
        sender_id : msg.sender_id,
        receiver_id : msg.receiver_id,
        room_type : msg.room_type,
      })

      io.to(msg.room_id).emit('chat message', added);
    }else{ // group chat

      const added = await Chat.create({
        room_id : msg.room_id,
        message : msg.message,
        sender_id : msg.sender_id,
        primary_room_id : msg.primary_room_id,
        room_type : msg.room_type,
      })

      io.to(msg.room_id).emit('chat message', added);
    }
    
  });

  socket.on('disconnecting', () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });

  socket.on('disconnect', () => {
    // socket.rooms.size === 0
  });
});

// Init MongoDB
initMongo()

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
