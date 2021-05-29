import React, {useEffect} from 'react'
import {
  useParams,
  Link,
  useHistory
} from 'react-router-dom'
import MessageForm from './MessageForm'
import useCookie from './useCookie'

export default function Chatroom (props) {
  const { roomname } = useParams()
  
  const [cookie, setCookie] = useCookie('chatroomCookie', '')
  let history = useHistory()
  useEffect(() => {
    if (!cookie) {
        history.push('/login')
      }
  }, [cookie])
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
