import React, { useState, useEffect } from 'react'
import {
  useHistory
} from 'react-router-dom'
import useCookie from './useCookie'
import axios from 'axios'

export default function Login (props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [cookie, setCookie] = useCookie('chatroomCookie', '')
  const history = useHistory()

  function handleChangeUsername (event) {
    setUsername(event.target.value)
  }

  function handleChangePassword (event) {
    setPassword(event.target.value)
  }

  function handleSubmit (event) {
    event.preventDefault()
    console.log(`username: ${username}, password: ${password}`)
    props.onLogin(username, password, setCookie)
    history.push('/')
  }
  useEffect(() => {
    console.log('useEffect TRIGGERED')
    if (cookie) {
      axios.post(`http://localhost:8000/reverse`, {cookie: cookie})
        .then(res => {
          console.log('RESPONSE DATA')
          console.log(res.data)
          props.foundUserName(res.data, cookie)
          history.push('/')
        })
    } else {
      setCookie('')
    }
  }, [cookie])

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='username...' value={username} onChange={handleChangeUsername} />
        <input type='password' placeholder='password...' value={password} onChange={handleChangePassword} />
        <button type='submit'>Login</button>
      </form>
    </>
  )
}
