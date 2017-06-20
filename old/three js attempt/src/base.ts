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
	occupant: Occupant;
	x: number;
	y: number;
	rendererCell: any;
	skipNext: boolean;

	constructor(grid, occupant, x, y, rendererCell) {
		this.grid = grid;
		this.occupant = occupant;
		this.x = x;
		this.y = y;
		this.rendererCell = rendererCell;
		this.skipNext = false;
	}

	clear() {
		this.occupant = null;
	}

	getColor() {
		return this.occupant == null ? null : this.occupant.color;
	}
	
	setOccupant(occupant: Occupant) {
		let newColor = occupant == null ? "white" : occupant.color;
		this.occupant = occupant;
	}

	skip() {
		this.skipNext = true;
	}
}


class Grid {
	renderer: Renderer
	width: number;
	height: number;
	drawBorders: boolean;
	squares: Array<Square>;
	startState: Array<Array<string>>;

	constructor(renderer, width, height, drawBorders) { 
		this.renderer = renderer;
		this.width = width;
		this.height = height
		this.drawBorders = drawBorders;
		this.squares = [];

		this.createGrid();
	}

	getSquare(x, y) {
		return this.squares[x * this.width + y];
	}

	getX(i: number) {
		return i % this.width;
	}

	getY(i: number) {
		return Math.floor(i / this.height);
	}

	createGrid() {
		let startX = this.renderer.camera.left + (this.width / 2);
		let startY = this.renderer.camera.bottom + (this.height / 2);
		let dx = Math.floor(this.renderer.width / this.width);
		let dy = Math.floor(this.renderer.height / this.height);

		for (let i = 0; i < this.width * this.height; i++) {
			let x = this.getX(i);
			let y = this.getY(i);

			let color = (i % 2 == 0)? "black" : "grey";

			let square = this.renderer.createGridCell(startX + x * dx, startY + y * dy, color);
			this.squares[i] = new Square(this, null, x, y, square);
		}
	}

	runBehaviors() {
		for (let i = 0; i < this.squares.length; i++) {
				let organism = this.squares[i].occupant;
				if (!this.squares[i].skipNext && organism != null) {
					let x = this.getX(i);
					let y = this.getY(i);
					organism.behavior(this.getNeighbors(x, y), this);
				}
		}
	}

	setOrganism(x, y, organism) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.width) {
			return;
		}
		let currentSquare = this.squares[x][y];
		currentSquare.setOccupant(organism);
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
