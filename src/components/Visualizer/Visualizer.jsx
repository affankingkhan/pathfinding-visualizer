import React, { useState, useEffect, createRef, useRef } from 'react';
import './Visualizer.css';
import { Label, Input } from 'reactstrap';
import Node from '../Node/Node';
import { dijkstra } from '../../algorithms/dijkstra';
import { dfs } from '../../algorithms/dfs';
import { aStar } from '../../algorithms/astar';
import { fetchNodesInShortestPathOrder } from '../../algorithms/helper';

const NUM_ROWS = 20;
const NUM_COLS = 50;
const START_NODE_ROW = 5;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 13;
const FINISH_NODE_COL = 38;
const DIJKSTRA_SPEED = 5;
const SHORTEST_PATH_SPEED = 50;

export const Visualizer = () => {
  /**
   * States
   */
  const [algorithm, setAlgorithm] = useState("Dijkstra's Algorithm");
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [visualizeDisabled, setVisualizeDisabled] = useState(false);

  const nodeRefs = useRef([]);

  // initilaize the grid on mount
  useEffect(() => {
    const grid = getInitialGrid();
    setNodeRefs(grid);
    setGrid(grid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNodeRefs = (grid) => {
    if (nodeRefs.current.length !== grid.length) {
      let refs = [];
      for (let i = 0; i < NUM_ROWS; i++) {
        let refRow = [];
        for (let j = 0; j < NUM_COLS; j++) {
          refRow.push(createRef);
        }
        refs.push(refRow);
      }
      nodeRefs.current = refs;
    }
  };

  const clearBoard = () => {
    setVisualizeDisabled(false);
    const grid = getInitialGrid();
    setNodeRefs(grid);
    setGrid(grid);
    clearAnimations();
  };

  const clearPath = () => {
    setVisualizeDisabled(false);
    clearAnimations();
    revertAllNodeButPreserveWalls();
  };

  const revertAllNodeButPreserveWalls = () => {
    let newGrid = [...grid];
    for (let row of newGrid) {
      for (let n of row) {
        n.distance = Infinity;
        n.isVisited = false;
        n.previousNode = null;
      }
    }
    setGrid(newGrid);
  };

  const clearAnimations = () => {
    for (let row of nodeRefs.current) {
      for (let col of row) {
        col.classList.remove('node-visited');
        col.classList.remove('node-shortest-path');
      }
    }
  };

  const changePathFindingAlgo = (e) => {
    setAlgorithm(e.target.value);
  };

  const checkUnChangeableNode = (row, col) => {
    return (
      (row === START_NODE_ROW && col === START_NODE_COL) ||
      (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
    );
  };

  const handleMouseDown = (row, col) => {
    if (checkUnChangeableNode(row, col) || disabled) return;
    const newGrid = fetchNewGridWithWallToggled(grid, row, col, 1);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || checkUnChangeableNode(row, col) || disabled) return;
    const newGrid = fetchNewGridWithWallToggled(grid, row, col, 2);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const setRef = (el) => {
    if (el) {
      let row = el.getAttribute('row');
      let col = el.getAttribute('col');
      nodeRefs.current[row][col] = el;
    }
  };

  const renderGrid = (grid) => {
    return grid.map((row, rowIdx) => {
      return (
        <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            const { row, col, type } = node;
            return (
              <Node
                key={nodeIdx}
                row={row}
                col={col}
                type={type}
                onMouseDown={() => handleMouseDown(row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
                onMouseUp={() => handleMouseUp()}
                refer={setRef}
              ></Node>
            );
          })}
        </div>
      );
    });
  };

  const visualize = () => {
    switch (algorithm) {
      case "Dijkstra's Algorithm":
        visualizeDijkstra();
        break;

      case 'Depth First Search':
        visualizeDFS();
        break;

      case 'A* Search':
        visualizeAStar();
        break;

      default:
        break;
    }
  };
  const visualizeDijkstra = async () => {
    await setVisualizeDisabled(true);
    await setDisabled(true);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = fetchNodesInShortestPathOrder(finishNode);
    await animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
    await setDisabled(false);
  };

  const visualizeDFS = async () => {
    await setVisualizeDisabled(true);
    await setDisabled(true);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = fetchNodesInShortestPathOrder(finishNode);
    await animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
    await setDisabled(false);
  };

  const visualizeAStar = async () => {
    await setVisualizeDisabled(true);
    await setDisabled(true);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = fetchNodesInShortestPathOrder(finishNode);
    await animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
    await setDisabled(false);
  };

  const animateAlgo = async (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        await animateShortestPath(nodesInShortestPathOrder);
        await timer(DIJKSTRA_SPEED);
        return;
      }
      const node = visitedNodesInOrder[i];
      nodeRefs.current[node.row][node.col].className = 'node node-visited';
      await timer(DIJKSTRA_SPEED);
    }
  };

  const animateShortestPath = async (nodesInShortestPathOrder) => {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      const node = nodesInShortestPathOrder[i];
      nodeRefs.current[node.row][node.col].className =
        'node node-shortest-path';
      await timer(SHORTEST_PATH_SPEED);
    }
  };

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  let displayGrid = renderGrid(grid);

  return (
    <div>
      <div className="custom-header">
        <div className="col-12">
          <div className="row">
            <div className="col-3">
              <div className="app-name"> Pathfinding Visualizer</div>
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-4">
                  <Label className="float-left white-font" for="algo-select">
                    Shortest Path Algorithm
                  </Label>
                  <Input
                    type="select"
                    name="algo-select"
                    id="algo-select"
                    onChange={changePathFindingAlgo}
                    value={algorithm}
                    disabled={disabled}
                  >
                    <option>Dijkstra's Algorithm</option>
                    <option>Depth First Search</option>
                    <option>A* Search</option>
                  </Input>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-lg btn-success float-right visualize-button mr-2"
                disabled={visualizeDisabled}
                onClick={visualize}
              >
                Visualize
              </button>
              <button
                type="button"
                className="btn btn-lg btn-secondary float-right mr-2"
                disabled={disabled}
                onClick={clearBoard}
              >
                Clear Board
              </button>
              <button
                type="button"
                className="btn btn-lg btn-secondary float-right mr-2"
                disabled={disabled}
                onClick={clearPath}
              >
                Clear Path
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid">{displayGrid}</div>
    </div>
  );
};

const getInitialGrid = () => {
  const grid = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    const currRow = [];
    for (let j = 0; j < NUM_COLS; j++) {
      currRow.push(createNode(i, j));
    }
    grid.push(currRow);
  }
  return grid;
};

const createNode = (row, col) => {
  let type = '';
  if (row === START_NODE_ROW && col === START_NODE_COL) {
    type = 'start';
  } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
    type = 'finish';
  }

  return {
    col,
    row,
    type,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    distanceToEnd: Infinity,
  };
};

const fetchNewGridWithWallToggled = (grid, row, col, val) => {
  console.log({ val });
  const newGrid = [...grid];
  const node = newGrid[row][col];
  let newType = node.type === 'wall' ? '' : 'wall';
  if (val === 2) {
    newType = 'wall';
  }
  const newNode = {
    ...node,
    type: newType,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
