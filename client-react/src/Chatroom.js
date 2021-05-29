import React from 'react'
import {
  useParams,
  Link
} from 'react-router-dom'
import MessageForm from './MessageForm'

export default function Chatroom (props) {
  const { roomname } = useParams()

  return (
    <>
      <Link to='/'>Back to Home</Link>
      <h1>{roomname}</h1>
      {(props.token) ? <MessageForm onSubmit={props.onSubmitMessage} room={roomname} nick={props.nick} token={props.token}/>:<div></div>}
      {props.messages
        .filter(msg => msg.room === roomname)
        .map((msg, index) => <li key={index}>{msg.username}: {msg.text}</li>)}
    </>
  )
}
