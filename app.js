const fs = require('fs')
const express = require('express')
const { Server } = require('socket.io')
const MongoClient = require('mongodb').MongoClient
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const User = require('./Models').User
const Room = require('./Models').Room
const Message = require('./Models').Message


app.use(express.static('static'))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

module.exports = function (deps) {
  const dbname = 'chatroom_data'
  const url = 'mongodb://localhost/' + dbname
  const mongoose = require('mongoose')
  mongoose.connect(url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
  })


  const server = require('http').createServer(app)
  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('a user connected')
    io.emit('all messages', Message.allMessages())
    io.emit('all rooms', Room.getRooms())
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg)
      

      io.emit('chat message', msg)
    })
    socket.on('new room', (room) => {
      Room.newRoom(room)

      io.emit('new room', room)
    })
  })

  return server
}
