import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const initialMessage = ''
  const initialEmail = ''
  const initialIndex = 4
  const initialSteps = 0

  const [ message, setMessage ] = useState(initialMessage);
  const [ email, setEmail ] = useState(initialEmail)
  const [ index, setIndex ] = useState(initialIndex)
  const [ steps, setSteps ] = useState(initialSteps)


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

    return { x, y }
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setIndex(initialIndex)
    setSteps(initialSteps)
  }

  function getNextIndex(current, direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let next = current;

    switch(direction) {
      case 'left':
        if(current % 3 !== 0){
          next = current - 1;
        }
        break;
      case 'up':
        if(current >= 3 ){
          next = current - 3;
        }
        break;
      case 'right':
        if(current % 3 !== 2){
          next = current + 1;
        }
        break;
      case 'down':
        if(current < 6){
          next = current + 3
        }
        break;
      default:
        break;
    }
    return next
  }

  function move(event) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = event.target.id;
    const nextIndex = getNextIndex(index, direction)
    if(index === nextIndex){
      setMessage(`You can't go ${direction}`)
    } else {
      setIndex((currentIndex) => getNextIndex(currentIndex, direction))
    setSteps(steps + 1)
    }

  }

  function onChange(event) {
    // You will need this to update the value of the input.
    const { id, value } = event.target

    if(id === 'email'){
      setEmail(value)
    }
  }

  function onSubmit(event) {
    // Use a POST request to send a payload to the server.
    event.preventDefault()

    const payload = {
      x: getXY().x,
      y: getXY().y,
      steps,
      email,
    }

    axios.post('http://localhost:9000/api/result', payload)
    .then(res => {
      //console.log('Post successful', res.data.message)
      setMessage(res.data.message)
      setEmail(initialEmail)
    })
    .catch(err => {
      //console.log(err.response.data.message)
      setMessage(err.response.data.message)
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit" value='Submit'></input>
      </form>
    </div>
  )
}
