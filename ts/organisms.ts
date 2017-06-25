import { GridManager, Cell, Occupant, Empty } from "grid";
import { OrganismGridManager } from "organism-grid-manager";
import { randomInt, randomSignedUnit, randomPercentage, integerSequence, randomOrdering } from "helpers";

export const PLANT = "plant";
export const DEAD_PLANT = "dead-plant";
export const HERBIVORE = "herbivore";
export const PARASITE = "parasite";
export const VINE = "vine";
export const WALL = "wall";
export const EMPTY = "empty";

export const getOrganism = function(type: string, cell: Cell): Organism {
	switch(type) {
		case WALL:
			return new Wall(cell);
		case PLANT:
			return new Plant(cell);
		case HERBIVORE:
			return new Herbivore(cell);
		case PARASITE:
			return new Parasite(cell);
		case DEAD_PLANT:
			return new DeadPlant(cell);
		case VINE:
			return new Vine(cell);
		case EMPTY:
			return <Organism>(new Empty(cell));
		default:
			throw "Invalid type"; 
	}
}

export class Organism extends Occupant {
	energy: number;
	behavior: (gridManager: OrganismGridManager) => void;

	constructor(name: string, color: string, cell: Cell, behavior?) {
		super(name, color, cell);
		this.behavior = behavior || function(){ };

	}
}

export class Wall extends Organism {
	constructor(cell: Cell) {
		super(WALL, "lightgray", cell);
	}
}

export class Plant extends Organism {
	constructor(cell: Cell, startEnergy: number = 0) {
		super(PLANT, "green", cell);
		this.energy = startEnergy;
		this.behavior = function(gridManager: OrganismGridManager) {
			if (randomPercentage(1)) {
				gridManager.cloneRandom(this);
			} else {
				gridManager.addToTurnQueue(this);
			}
		}
	}
}

export class DeadPlant extends Organism {
	constructor(cell: Cell, startEnergy: number = 100) {
		super(DEAD_PLANT, "darkgreen", cell);
		this.energy = startEnergy;
		this.behavior = function(gridManager: OrganismGridManager) {
			if (randomPercentage(15)) {
				this.energy--;
			}
			if (this.energy <= 0) {
				gridManager.addCellsToTurnQueue(gridManager.getNeighbors(this));
				gridManager.kill(this);
				return;
			}
			gridManager.addToTurnQueue(this);
		}
	}
}

export class Herbivore extends Organism {
	constructor(cell: Cell, startEnergy: number = 50) {
		super(HERBIVORE, "blue", cell);
		this.energy = startEnergy;
		this.behavior = function(gridManager: OrganismGridManager) {
			let neighbors: Cell[] = gridManager.getNeighbors(this);
			if (this.energy <= 0) {
				gridManager.kill(this);
				return;
			} 
			let plantNeighbors = gridManager.getNeighborsOfType(this, PLANT);
			if (plantNeighbors.length > 0) {
				if (this.energy <= 200) {
					this.energy += 5;
					let oldX = this.cell.x;
					let oldY = this.cell.y;
					gridManager.moveRandom(this, plantNeighbors);
					gridManager.setType(oldX, oldY, DEAD_PLANT);
				} else {
					this.energy /= 2;
					gridManager.cloneRandom(this, plantNeighbors);
				}
				gridManager.addCellsToTurnQueue(neighbors);
			} else {
				this.energy -= 2;
				if (randomPercentage(10)) {
					gridManager.moveRandom(this, gridManager.getNeighborsOfTypes(this, ["empty", HERBIVORE, DEAD_PLANT], false));
				} else {
					gridManager.addToTurnQueue(this);
				}
			}
		}
	}
}

export class Parasite extends Organism {
	constructor(cell: Cell, startEnergy: number = 10) {
		super(PARASITE, "red", cell);
		this.energy = startEnergy;
		this.behavior = function(gridManager: OrganismGridManager) {
			if (this.energy <= 0) {
				gridManager.kill(this);
				return;
			}
			let parasiteNeighbors = gridManager.getNeighborsOfType(this, PARASITE, true);
			let plantNeighbors = gridManager.getNeighborsOfType(this, PLANT, true);
			if (parasiteNeighbors.length >= 5 || plantNeighbors.length == 0) {
				this.energy -= 1;
				gridManager.addToTurnQueue(this);
			} else if (parasiteNeighbors.length < 6) {
				this.energy += 1;
				gridManager.addToTurnQueue(this);
			}
			if (this.energy > 250) { 
				if (plantNeighbors.length > 0) {
					this.energy = 1;
					gridManager.cloneRandom(this, plantNeighbors);
					gridManager.addCellsToTurnQueue(plantNeighbors);
				}		
			}
		}
	}
}

export class Vine extends Organism {
	constructor(cell: Cell, startEnergy: number = 0) {
		super(VINE, "purple", cell);
		this.energy = startEnergy;
		this.behavior = function(gridManager: OrganismGridManager) {
		}
	}
}