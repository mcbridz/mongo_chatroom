// const io = require('./client-react/node_modules/socket')
const io = require('./client-react/node_modules/socket.io/client-dist/socket.io.js')
const socket = io()

const rooms = ['General', 'Random', 'Matrix', 'Marvel', 'DC', 'Kink', 'Anime']

const messages = ['Hello', 'How are you?', 'Good bye', 'I am awesome', 'Johnny', 'Don\'t Ever Let Go Jack!']

const usernames = ['John', 'Jane', 'Jack', 'Zach', 'Jo', 'James', 'Matthew']


for (let i = 0; i < rooms.length; ++i){
    socket.emit('new room', rooms[i])
}

for (let i = 0; i < 200; ++i){
    socket.emit('chat message', {
        nick: usernames[Math.floor(Math.random() * usernames.length)],
        text: messages[Math.floor(Math.random() * messages.length)],
        room: rooms[Math.floor(Math.random()*rooms.length)]
    })
}