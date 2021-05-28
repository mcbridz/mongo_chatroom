import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Login (props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    props.onLogin(username)
    history.push('/')
  }

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
