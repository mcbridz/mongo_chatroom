const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    const message = new this()
    message.text = messageData['text']
    message.room = messageData['room']
    message.username = messageData['nick']
    await message.save()
    return message
}

messageSchema.statics.allMessages = async function () {
    this.find({}, (err, messages) => {        
        if (err) return err
        // console.log('typeof messages: ')
        // console.log(messages)
        // if (typeof (messages) === 'Object') {
        //     return [messages]
        // }
        console.log(`SENDING ${messages.length} MESSAGES`)
        return messages
    })
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
    this.find({},(err, rooms) => {
        if (err) return err
        let output = []
        rooms.map(roomObj => {
            output.push(roomObj.name)
        })
        console.log('SENDING ROOMS ARRAY')
        console.log(output)
        return output
    })
}
const Room = mongoose.model('Room', roomSchema)





module.exports = {User, Message, Room}