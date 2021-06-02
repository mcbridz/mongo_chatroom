import './App.css'
import React from 'react'
import Rooms from './Rooms'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Login from './Login'
import Chatroom from './Chatroom'
import Register from './Register'
import Logout from './Logout'
import axios from 'axios'

import io from '../../node_modules/socket.io/client-dist/socket.io.js'
const socket = io("http://localhost:8000")
// const URL = `${window.location.protocol}//${window.location.hostname}`
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      rooms: [],
      nick: '',
      token: ''
    }
  }

  componentDidMount() {
    // const rooms = ['General', 'Random', 'Matrix', 'Marvel', 'DC', 'Kink', 'Anime']

    // const messages = ['Hello', 'How are you?', 'Good bye', 'I am awesome', 'Johnny', 'Don\'t Ever Let Go Jack!']

    // const usernames = ['John', 'Jane', 'Jack', 'Zach', 'Jo', 'James', 'Matthew']


    // for (let i = 0; i < rooms.length; ++i){
    //   socket.emit('new room', rooms[i])
    // }

    // for (let i = 0; i < 200; ++i){
    //   socket.emit('chat message', {
    //       nick: usernames[Math.floor(Math.random() * usernames.length)],
    //       text: messages[Math.floor(Math.random() * messages.length)],
    //       room: rooms[Math.floor(Math.random()*rooms.length)]
    //   })
    // }



    socket.on('chat message', msg => {
      // console.log('/////////////message/////////////////////')
      // console.log(this.state.messages)
      this.setState({ messages: this.state.messages.concat(JSON.parse(msg)) })
      // console.log('got a message')
      // console.log(msg)
      // console.log('/////////////////////////////////////////')
    })
    socket.on('all messages', messages => {
      // console.log('/////////////messages////////////////////')
      // console.log(JSON.parse(messages))
      // console.log('/////////////////////////////////////////')
      this.setState({ messages: JSON.parse(messages) })
    })
    socket.on('all rooms', rooms => {      
      // console.log('///////////////rooms/////////////////////')
      // console.log(JSON.parse(rooms))
      // console.log('/////////////////////////////////////////')
      this.setState({ rooms: JSON.parse(rooms) })
    })
    socket.on('new room', room => {
      // console.log('////////////////new room/////////////////')
      // console.log(room)
      // console.log('/////////////////////////////////////////')
      this.state.rooms.concat(room)
    })
  }

  handleSubmitMessage (nick, text, room, token) {
    const message = { nick: nick, room: room, text:text, token: token }
    console.log(JSON.stringify(message))
    socket.emit('chat message', JSON.stringify(message))
  }

  handleLogin(username, password, callback) {
    this.setState({ nick: username })
    axios.post(`http://localhost:8000/login`,{
      username: username,
      password: password,
    }).then((res) => {
      console.log(res.data)
      this.setState({ token: res.data.token })
      callback(res.data.token)
    })
  }

  handleNewRoom(room) {
    socket.emit('new room', room)
  }

  logout() {
    return () => {
      this.setState({ nick: '', token: '' })
    }
  }
  foundUserName(nick, token) {
    this.setState({nick: nick, token: token})
  }

  render () {
    return (
      <div className='App'>
        {(!this.state.token) ? <><Link to='/login'>Login</Link> <Link to='/register'>Register</Link></>: <Link to='/logout' style={{ textDecoration: 'underline' }} onClick={this.logout()}>Logout</Link>}
        <Switch>
          <Route path='/login'>
            <Login onLogin={this.handleLogin.bind(this)} token={this.state.token} foundUserName={ this.foundUserName.bind(this)}/>
          </Route>

          <Route path='/register'>
            <Register/>
          </Route>

          <Route path='/rooms/:roomname'>
            <Chatroom onSubmitMessage={this.handleSubmitMessage.bind(this)} messages={this.state.messages} nick={this.state.nick} token={this.state.token}/>
          </Route>

          <Route exact path='/'>
            <h1>Chatroom phase 6</h1>
            <Rooms rooms={this.state.rooms} handleNewRoom={this.handleNewRoom.bind(this)}/>
          </Route>
          <Route path='/logout'>
            <Logout token={this.state.token}/>
          </Route>
        </Switch>
      </div>
    )
  }
}

export default App
