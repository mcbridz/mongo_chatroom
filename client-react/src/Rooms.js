import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'


export default function Rooms (props) {
  const [newRoom, setNewRoom] = useState('')
  const history = useHistory()
  const handleNewRoom = props.handleNewRoom

  function addRoom () {
    const newRoom = prompt('enter a new room name: ')
    setNewRoom(newRoom)
    handleNewRoom(newRoom)
    history.push('/rooms/' + newRoom)
  }

  function handleChange (event) {
    history.push('/rooms/' + event.target.value)
  }

  return (
    <div id='room'>
      <button onClick={addRoom}>Add Room</button>
      <label htmlFor='room-select'>Change Room:</label>
      <select onChange={handleChange} value={newRoom} id='room-select'>
        <option value=''>--Select a Room--</option>
        {props.rooms.map(room => <option key={room} value={room}>{room}</option>)}
      </select>
    </div>
  )
}
