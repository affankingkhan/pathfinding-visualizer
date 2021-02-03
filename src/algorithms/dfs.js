export const dfs = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const stack = [];
  stack.push(startNode);
  while (stack.length) {
    let currNode = stack.pop();
    //if wall, continue
    if (currNode.type === 'wall') continue;
    //if distance of closes is infinity, we are stuck so return the current list of visited nodes
    if (currNode.distance === Infinity) return visitedNodesInOrder;
    currNode.isVisited = true;
    visitedNodesInOrder.push(currNode);
    if (currNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(currNode, grid);
    let neighbors = fetchUnvisitedNeighbors(currNode, grid);
    for (let node of neighbors) {
      stack.push(node);
    }
  }
  return visitedNodesInOrder;
};

const updateUnvisitedNeighbors = (node, grid) => {
  const unvisitedNeighbors = fetchUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const fetchUnvisitedNeighbors = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};
