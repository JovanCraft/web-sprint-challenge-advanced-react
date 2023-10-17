import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props){
    super(props)

    this.state = {
      ...initialState,
      email: '',
    }
    this.reset = this.reset.bind(this)
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const index = this.state.index
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1

    return { x, y }
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      ...initialState,
      email: '',
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const current = this.state.index;
    let next = current;

    switch (direction) {
      case 'left':
        if(current % 3 !== 0){
          next = current - 1;
        }
        break;
      case 'up':
        if(current >= 3){
          next = current - 3
        }
        break;
      case 'right':
        if(current % 3 !== 2){
          next = current + 1
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

  move = (event) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = event.target.id;
    //console.log('Button clicked', direction)
    const next = this.getNextIndex(direction);
    const steps = this.state.steps + 1;

    this.setState({
      index: next,
      steps: steps
    })
  }

  onChange = (event) => {
    // You will need this to update the value of the input.
    const { id, value } = event.target;

    if(id === 'email'){
      this.setState({
        email: value,
      })
    }
  };

  onSubmit = (event) => {
    // Use a POST request to send a payload to the server.
    event.preventDefault();

    const payload = {
      x: this.getXY().x,
      y: this.getXY().y,
      steps: this.state.steps,
      email: this.state.email,
    };

    axios.post('http://localhost:9000/api/result', payload)
    .then(res => {
      console.log('Post successful', res.data.message)
    })
    .catch(err => {
      console.log('Post error', err);
    })
  }

  render() {
    const { className } = this.props
    const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const getXYMessage = `Coordinates (${this.getXY().x}, ${this.getXY().y})`;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{getXYMessage}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
           squares.map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit" value='Submit'></input>
        </form>
      </div>
    )
  }
}
