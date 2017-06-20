class Occupant {
	name: string;
	color: string;
	behavior: (neighbors: Neighbors, grid?: Grid) => void;

	constructor(name, color, behavior?) {
		this.name = name;
		this.color = color;
		this.behavior = behavior;
	}

}

enum Direction {
	N, NE, E, SE, S, SW, W, NW
}

class Neighbors {
	myself: Square;
	arr: Square[];

	constructor(myself, n, ne, e, se, s, sw, w, nw) {
		this.myself = myself;
		this.arr = [n, ne, e, se, s, sw, w, nw];
	}

	getNonDiagonalArray(): Square[] {
		return [this.arr[0], this.arr[2], this.arr[4], this.arr[6]];
	}
}

class Square {
	grid: Grid;
	organism: Organism;
	x: number;
	y: number;
	svgBox: HTMLElement;
	skipNext: boolean;

	constructor(grid, organism, x, y, svgBox) {
		this.grid = grid;
		this.organism = organism;
		this.x = x;
		this.y = y;
		this.svgBox = svgBox;
		this.skipNext = false;
	}

	clear() {
		this.organism = null;
	}

	getColor() {
		return this.organism == null ? null : this.organism.color;
	}
	
	setOrganism(organism: Organism) {
		let newColor = organism == null ? "white" : organism.color;
		this.organism = organism;
		this.svgBox.setAttribute("style", getBoxStyle(newColor, grid.drawBorders));
	}

	skip() {
		this.skipNext = true;
	}
}


class Grid {
	svg: HTMLElement;
	width: number;
	height: number;
	drawBorders: boolean;
	squares: Array<Array<Square>>;
	startState: Array<Array<string>>;

	constructor(svg, width, height, drawBorders) { 
		this.svg = svg;
		this.width = width;
		this.height = height
		this.drawBorders = drawBorders;
		this.squares = [];
		this.startState = [];

		this.createGrid();
	}

	createGrid() {
		let svgWidth = parseInt(this.svg.getAttribute("width")) - 1;
		let svgHeight = parseInt(this.svg.getAttribute("height")) - 1;
		let dx = svgWidth / this.width;
		let dy = svgHeight / this.height;

		for (let x = 0; x < this.width; x++) {
			this.squares[x] = [];
			this.startState[x] = [];
			for (let y = 0; y < this.height; y++) {
				let box = this.createBox(x, y, dx, dy, "white");
				this.squares[x][y] = new Square(this, null, x, y, box);
				this.startState[x][y] = null;
				this.svg.appendChild(box);
			}
		}
	}

	runBehaviors() {
		this.setStartState();
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let organism = this.squares[x][y].organism;
				if (!this.squares[x][y].skipNext && organism != null) {
					organism.behavior(this.getNeighbors(x, y), this);
				}
				this.squares[x][y].skipNext = false;
			}
		}
	}

	setStartState() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let organism = this.squares[x][y].organism;
				if (organism == null) {
					this.startState[x][y] = null
				} else {
					this.startState[x][y] = organism.name;
				}
			}
		}
	}

	setOrganism(x, y, organism) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.width) {
			return;
		}
		let currentSquare = this.squares[x][y];
		currentSquare.setOrganism(organism);
	}

	getNeighbors(x, y) {
		let xMax = this.width - 1;
		let yMax = this.height - 1;

		if (x > xMax || x < 0 || y > yMax || y < 0) {
			console.log("(" + x + "," + y + ") is out of bounds");
			return null;
		}

		return new Neighbors(
			this.squares[x][y],
			y > 0 ? this.squares[x][y-1] : null,
			x < xMax && y > 0 ? this.squares[x+1][y-1] : null,
			x < xMax ? this.squares[x+1][y] : null,
			x < xMax && y < yMax ? this.squares[x+1][y+1] : null,
			y < yMax ? this.squares[x][y+1] : null,
			x > 0 && y < yMax ? this.squares[x-1][y+1] : null,
			x > 0 ? this.squares[x-1][y] : null,
			x > 0 && y > 0 ? this.squares[x-1][y-1] : null
		);
	}

	createBox(xPos, yPos, width, height, color) {
		let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		box.setAttribute("height", width);
		box.setAttribute("width", height);
		box.setAttribute("style", getBoxStyle(color, this.drawBorders));
		box.setAttribute("x", (width * xPos).toString());
		box.setAttribute("y", (height * yPos).toString());
		box.setAttribute("onclick", "squareClicked(" + xPos + "," + yPos + " )");
		box.addEventListener("mouseover", function(e) {mousedOver(xPos, yPos);});
		return box;
	}

	resetGrid() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.setOrganism(x, y, null);
			}
		}
	}
}

function getBoxStyle(color, drawBorders) {
	let borderColor = color;
	if (drawBorders) {
		borderColor = "black";
	}
	return "fill:" + color + ";stroke:" + borderColor + ";stroke-width:1";;
}
