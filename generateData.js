// const io = require('./client-react/node_modules/socket')
const io = require('./client-react/node_modules/socket.io/client-dist/socket.io.js')
const socket = io()

const rooms = ['General', 'Random', 'Matrix', 'Marvel', 'DC', 'Kink', 'Anime']

const messages = ['Hello', 'How are you?', 'Good bye', 'I am awesome', 'Johnny', 'Don\'t Ever Let Go Jack!']

const usernames = ['John', 'Jane', 'Jack', 'Zach', 'Jo', 'James', 'Matthew']


for (let i = 0; i < rooms.length; ++i){
    socket.emit('new room', rooms[i])
}