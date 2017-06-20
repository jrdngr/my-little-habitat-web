var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function getLiveNeighbors(x, y, width, height, state) {
    var liveNeighbors = 0;
    if (y > 0 && state[x][y - 1] != "gameoflifedead")
        liveNeighbors++;
    if (y > 0 && x < width && state[x + 1][y - 1] != "gameoflifedead")
        liveNeighbors++;
    if (x < width && state[x + 1][y] != "gameoflifedead")
        liveNeighbors++;
    if (x < width && y < height && state[x + 1][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (y < height && state[x][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (y < height && x > 0 && state[x - 1][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (x > 0 && state[x - 1][y] != "gameoflifedead")
        liveNeighbors++;
    if (x > 0 && y > 0 && state[x - 1][y - 1] != "gameoflifedead")
        liveNeighbors++;
    return liveNeighbors;
}
var gameOfLiveAliveParameters = {
    minimumNeighborsToLive: 2,
    maximumNeighborsToLive: 3,
};
var GameOfLife = (function (_super) {
    __extends(GameOfLife, _super);
    function GameOfLife() {
        var _this = _super.call(this, "gameoflife", "black") || this;
        _this.behavior = function (neighbors, grid) {
            var x = neighbors.myself.x;
            var y = neighbors.myself.y;
            var state = grid.startState;
            var liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
            if (liveNeighbors < gameOfLiveAliveParameters.minimumNeighborsToLive || liveNeighbors > gameOfLiveAliveParameters.maximumNeighborsToLive) {
                neighbors.myself.setOccupant(new GameOfLifeDead());
            }
        };
        return _this;
    }
    return GameOfLife;
}(Occupant));
var gameOfLiveDeadParameters = {
    numberOfNeighborsToLive: 3
};
var GameOfLifeDead = (function (_super) {
    __extends(GameOfLifeDead, _super);
    function GameOfLifeDead() {
        var _this = _super.call(this, "gameoflifedead", "lightgray") || this;
        _this.behavior = function (neighbors) {
            var x = neighbors.myself.x;
            var y = neighbors.myself.y;
            var state = grid.startState;
            var liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
            if (liveNeighbors == gameOfLiveDeadParameters.numberOfNeighborsToLive) {
                neighbors.myself.setOccupant(new GameOfLife());
            }
        };
        return _this;
    }
    return GameOfLifeDead;
}(Occupant));
//# sourceMappingURL=gameoflife.js.map