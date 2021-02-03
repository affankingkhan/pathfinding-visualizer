export const dijkstra = (grid, startNode, finishNode) => {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = fetchAllNodes(grid);
  while (unvisitedNodes.length) {
    //sort and get the closest node
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    //if wall, continue
    if (closestNode.type === 'wall') continue;
    //if distance of closes is infinity, we are stuck so return the current list of visited nodes
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
};

const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((a, b) => a.distance - b.distance);
};

const fetchAllNodes = (grid) => {
  let nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
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
