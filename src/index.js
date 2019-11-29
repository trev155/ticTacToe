import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let squareClassName = "square";
  if (props.winner && props.winner.includes(props.index)) {
    squareClassName = "square winLine";
  }
  
  return (
    <button className={squareClassName} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        index={i}
        winner={this.props.winner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
       />
    );
  }

  render() {
    let grid = []
    for (let row = 0; row < 3; row++) {
      let squaresRow = [];
      for (let col = 0; col < 3; col++) {
        squaresRow.push(this.renderSquare((row * 3) + col));
      }      
      grid.push(<div key={row} className='board-row'>{squaresRow}</div>);
    }

    return (
      <div>{grid}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movePosition: Array(2).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      showMovesInReverse: false
    }
  }

  handleClick(i) {
    const col = (i % 3) + 1;
  	const row = Math.floor(i / 3) + 1;
  	const movePosition = [col, row];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        movePosition: movePosition
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMoveList() {
    this.setState({
      showMovesInReverse: !this.state.showMovesInReverse
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    if (this.state.showMovesInReverse) {
      history = history.slice(0).reverse();
    }

    const moves = history.map((step, move) => {
      const movePosition = history[move].movePosition;
      if (this.state.showMovesInReverse) {
        move = history.length - move - 1;
      }

      let desc = move ?
        'Go to move #' + move + " - [Column: " + movePosition[0] + ", Row: " + movePosition[1] + "] (" + ((move % 2 === 1) ? "X" : "O") + ")" :
        'Go to game start';
      if (this.state.stepNumber === move) {
        desc = <b>{desc}</b>
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseMoveList()}>Show Moves In Reverse Order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
