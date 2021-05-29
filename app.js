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
  app.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, async (err, user) => {
      // console.log(`Found user: ${user.username}`)
      if (err) return res.status(500).send(err)
      if (!user) return res.status(400).send('Invalid login ingo')
      // console.log(`User is valid`)
      const matchingPassword = await user.comparePassword(req.body.password)
      // console.log(`password verified as : ${matchingPassword}`)
      if (!matchingPassword) return res.status(400).send('Invalid login ingo')
      // console.log(`Signing token with key: ${key}`)
      jwt.sign({ _id: user._id }, key, (err, token) => {
          if (err) return res.status(500).send(err)
          res.send({ token })
      })
  })
  })
  app.post('/register', (req, res) => {
    console.log(`Looking for user ${req.body.username}`)
    User.findOne({ username: req.body.username }, async (err, userExists) => {
        console.log('finished searching for username')
        if (err) return res.status(500).send(err)
        if (userExists) return res.status(400).send('username already exists')
        console.log('creating user')
        const user = await User.signup(req.body.username, req.body.password)
        res.status(201).send(user.sanitize())
    })
})


  const server = require('http').createServer(app)
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('a user connected')
    Message.allMessages().then(messages => {
      console.log('chained arrow function')
      console.log(`${messages.length} MESSAGES BEING SENT`)
      io.emit('all messages', JSON.stringify(messages))
    })
    
    Room.getRooms().then(rooms => {
      let output = []
      rooms.map(roomObj => {
        output.push(roomObj.name)
      })
      console.log('SENDING ROOMS ARRAY')
      console.log(output)
      io.emit('all rooms', JSON.stringify(output))      
    })


    socket.on('chat message', (msg) => {
      console.log('message: ' + msg)
      Message.newMessage(JSON.parse(msg))

      io.emit('chat message', msg)
    })
    socket.on('new room', (room) => {
      Room.newRoom(room)

      io.emit('new room', room)
    })
  })

  return server
}
