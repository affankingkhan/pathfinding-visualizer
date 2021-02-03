import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      type,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
      refer,
    } = this.props;

    const typeClassName = type ? `node-${type}` : '';
    return (
      <div
        id={`node-${row}-${col}`}
        row={row}
        col={col}
        className={`node ${typeClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        ref={refer}
      ></div>
    );
  }
}
