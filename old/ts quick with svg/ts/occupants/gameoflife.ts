function getLiveNeighbors(x, y, width, height, state) {
	let liveNeighbors = 0;
	if (y > 0 && state[x][y-1] != "gameoflifedead") liveNeighbors++;
	if (y > 0 && x < width && state[x+1][y-1] != "gameoflifedead") liveNeighbors++;
	if (x < width && state[x+1][y] != "gameoflifedead") liveNeighbors++;
	if (x < width && y < height && state[x+1][y+1] != "gameoflifedead") liveNeighbors++;
	if (y < height && state[x][y+1] != "gameoflifedead") liveNeighbors++;
	if (y < height && x > 0 && state[x-1][y+1] != "gameoflifedead") liveNeighbors++;
	if (x > 0 && state[x-1][y] != "gameoflifedead") liveNeighbors++;
	if (x > 0 && y > 0 && state[x-1][y-1] != "gameoflifedead") liveNeighbors++;
	return liveNeighbors;
}

var gameOfLiveAliveParameters = {
	minimumNeighborsToLive:	2,
	maximumNeighborsToLive:	3,
}
class GameOfLife extends Occupant {
	constructor() {
		super("gameoflife", "black");
		this.behavior = function(neighbors, grid){
			let x = neighbors.myself.x;
			let y = neighbors.myself.y;
			let state = grid.startState;
			let liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
			if (liveNeighbors < gameOfLiveAliveParameters.minimumNeighborsToLive || liveNeighbors > gameOfLiveAliveParameters.maximumNeighborsToLive) {
				neighbors.myself.setOrganism(new GameOfLifeDead());
			} 
		};
	}
}

var gameOfLiveDeadParameters = {
	numberOfNeighborsToLive: 3
}
class GameOfLifeDead extends Organism {
	constructor() {
		super("gameoflifedead", "lightgray");
		this.behavior = function(neighbors){
			let x = neighbors.myself.x;
			let y = neighbors.myself.y;
			let state = grid.startState;
			let liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
			if (liveNeighbors == gameOfLiveDeadParameters.numberOfNeighborsToLive) {
				neighbors.myself.setOrganism(new GameOfLife());
			} 
		};
	}
}