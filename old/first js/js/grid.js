// Drawing
class pathString {
	constructor(svg) {
		this.svg = svg;
		this.str = "";
	}
	moveTo(x, y) {
		this.str += "M " + x + " " + y + " ";
	}
	lineTo(x, y) {
		this.str += "L " + x + " " + y + " ";
	}
	toString() {
		return this.str;
	}
}

function drawGrid(svg, numHorizontal, numVertical) {
	let width = svg.getAttribute("width") - 1;
	let height = svg.getAttribute("height") - 1;
	let dx = width / numHorizontal;
	let dy = height / numVertical;
	
	let gridString = new pathString(svg);
	gridString.moveTo(1, 1);
	gridString.lineTo(1, height);
	for (let i = 0; i <= numHorizontal; i++) {
		gridString.moveTo(dx*i, 1);
		gridString.lineTo(dx*i, height);
	}
	gridString.moveTo(1, 1);
	gridString.lineTo(width, 1);
	for (let i = 0; i <= numVertical; i++) {
		gridString.moveTo(1, dy*i);
		gridString.lineTo(width, dy*i );
	}

	let grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
	grid.setAttribute("stroke", "black");
	grid.setAttribute("stroke-width", 1);
	grid.setAttribute("d", gridString);
	svg.appendChild(grid);
}


// Core grid stuff

class Occupant {
	constructor(name, color, behavior) {
		this.name = name;
		this.color = color;
		this.behavior = behavior;
		this.energy = 0;
	}
}

class Empty extends Occupant {
	constructor() {
		super("empty", "white", function(grid) {return "nada";} );
		this.energy = 10;
	}
}

class Plant extends Occupant {
	constructor() {
		super("plant", "green", function(grid) {
			this.energy++;
			if (this.energy >= 10) {
				this.energy = 0;
				return this.spread();
			}
			else
			{
				return "nada";                                                 
			}
		 });
	}

	spread() {
		console.log("SPREADING!");
		return "nada";
	}
}

class Grid {
	constructor(svg, width, height) {                  
		this.svg = svg;
		this.width = width;
		this.height = height;
		this.elements = [];
		for (let i = 0; i < this.width; i++) {
			this.elements[i] = [];
			for (let j = 0; j < this.height; j++) {
				this.elements[i][j] = new Empty()
			}
		}
	}

	runBehaviors() {
		let svgWidth = this.svg.getAttribute("width") - 1;
		let svgHeight = this.svg.getAttribute("height") - 1;
		let dx = svgWidth / this.width;
		let dy = svgHeight / this.height;

		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				let currentElement = this.elements[i][j];

				let box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				box.setAttribute("height", dx);
				box.setAttribute("width", dy);
				box.setAttribute("style","fill:" + currentElement.color + ";stroke:black;stroke-width:1");
				box.setAttribute("x", dx * i);
				box.setAttribute("y", dy * j);
				this.svg.appendChild(box);
				currentElement.behavior(this);
			}
		}
	}

	draw() {

	}
}
