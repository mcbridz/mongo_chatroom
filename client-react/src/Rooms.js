import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function getRooms (messages, newRoom) {
  console.log(messages)
  const rooms = messages.map(msg => msg.room)
  rooms.push(newRoom)
  const allRooms = rooms.filter(room => room)

  const uniqrooms = Array.from(new Set(allRooms))
  return uniqrooms
}

export default function Rooms (props) {
  const [newRoom, setNewRoom] = useState('')
  const history = useHistory()

  function addRoom () {
    const newRoom = prompt('enter a new room name: ')
    setNewRoom(newRoom)
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
        {getRooms(props.messages, newRoom).map(room => <option key={room} value={room}>{room}</option>)}
      </select>
    </div>
  )
}
