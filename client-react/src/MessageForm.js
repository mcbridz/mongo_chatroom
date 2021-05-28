import React, { useState } from 'react'

export default function MessageForm (props) {
  const [inputValue, setInputValue] = useState('')

  function handleChange (event) {
    setInputValue(event.target.value)
  }

  function handleSubmit (event) {
    event.preventDefault()
    props.onSubmit(inputValue, props.room)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' value={inputValue} onChange={handleChange} />
      <button type='submit'>Send</button>
    </form>
  )
}
