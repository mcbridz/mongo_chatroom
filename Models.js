const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const key = '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b'
const Schema = mongoose.Schema



//User Schema, methods, and statics
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.signup = async function (username, plainTextPassword) {
    const user = new this()
    user.username = username
    await user.hashPassword(plainTextPassword)
    await user.save()
    return user
}

userSchema.methods.sanitize = function () {
    return {
        ...this._doc,
        password: undefined
    }
}

userSchema.methods.hashPassword = function (plainTextPassword) {
    const user = this
    let randomSalt = Math.floor(Math.random() * 4 + 2)
    return bcrypt.hash(plainTextPassword, randomSalt).then(hash => {
        user.password = hash
    })
}

userSchema.methods.comparePassword = function (plainTextPassword) {
    const user = this
    return bcrypt.compare(plainTextPassword, user.password)
}

const User = mongoose.model('User', userSchema)

// Chatroom schema, methods and statics
const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})

messageSchema.statics.newMessage = async function (messageData) {
    const token = messageData['token']
    const payload = jwt.decode(token, key)
    const user = await User.findOne({_id: payload._id})
    if (jwt.verify(token, key) && user) {
        const message = new this()
        message.text = messageData['text']
        message.room = messageData['room']
        message.username = messageData['nick']
        await message.save()
        return message        
    }
    return null
}

messageSchema.statics.allMessages = function () {
    return this.find({})
}
const Message = mongoose.model('Message', messageSchema)

// Room schema, methods and statics

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

roomSchema.statics.newRoom = async function (roomName) {
    const room = new this()
    room.name = roomName
    await room.save()
    return room
}

roomSchema.statics.getRooms = async function () {
    return this.find({})
    // this.find({},(err, rooms) => {
    //     if (err) return err
    //     let output = []
    //     rooms.map(roomObj => {
    //         output.push(roomObj.name)
    //     })
    //     console.log('SENDING ROOMS ARRAY')
    //     console.log(output)
    //     return output
    // })
}
const Room = mongoose.model('Room', roomSchema)





module.exports = {User, Message, Room}