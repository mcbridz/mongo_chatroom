import './App.css'
import React from 'react'
import Rooms from './Rooms'
import {
  Switch,
  Route
} from 'react-router-dom'
import Login from './Login'
import Chatroom from './Chatroom'

import io from '../../node_modules/socket.io/client-dist/socket.io.js'
const socket = io()

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      rooms: [],
      nick: ''
    }
  }

  componentDidMount () {
    socket.on('chat message', msg => {
      console.log(this.state.messages)
      this.setState({ messages: this.state.messages.concat(msg) })
      console.log('got a message')
      console.log(msg)
    })
    socket.on('all messages', messages => {
      console.log('/////////////////////////////////////////')
      console.log(messages)
      console.log('/////////////////////////////////////////')
      this.setState({ messages:messages })
    })
    socket.on('all rooms', rooms => {      
      console.log('/////////////////////////////////////////')
      console.log(rooms)
      console.log('/////////////////////////////////////////')
      this.setState({ rooms:rooms })
    })
    socket.on('new room', room => {
      console.log('/////////////////////////////////////////')
      console.log(room)
      console.log('/////////////////////////////////////////')
      this.state.rooms.concat(room)
    })
  }

  handleSubmitMessage (text, room) {
    const message = { nick: this.state.nick, room, text }
    console.log(message)
    socket.emit('chat message', message)
  }

  handleLogin (username) {
    this.setState({ nick: username })
  }

  handleNewRoom(room) {
    socket.emit('new room', room)
  }

  render () {
    return (
      <div className='App'>
        <Switch>
          <Route path='/login'>
            <Login onLogin={this.handleLogin.bind(this)} />
          </Route>

          <Route path='/rooms/:roomname'>
            <Chatroom onSubmitMessage={this.handleSubmitMessage.bind(this)} messages={this.state.messages} />
          </Route>

          <Route exact path='/'>
            <h1>Chatroom phase 6</h1>
            <Rooms rooms={this.state.rooms} handleNewRoom={this.handleNewRoom.bind(this)}/>
          </Route>
        </Switch>
      </div>
    )
  }
}

export default App
