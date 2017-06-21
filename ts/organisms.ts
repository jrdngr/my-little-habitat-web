import { GridManager, Cell, Occupant } from "grid";
import { OrganismGridManager } from "organism-grid-manager";
import { randomInt, randomSignedUnit, randomPercentage } from "helpers";

export const getOrganism = function(name: string, cell: Cell): Organism {
	switch(name) {
		case "plant":
			return new Plant(cell);
		case "herbivore":
			return new Herbivore(cell);
		case "parasite":
			return new Parasite(cell);
		default:
			return new Plant(cell); 
	}
}

export class Organism extends Occupant {
	energy: number;
	behavior: (grid: GridManager) => void;

	constructor(name: string, color: string, cell: Cell, behavior?) {
		super(name, color, cell);
		this.behavior = behavior || function(){ };

	}
}

export class Plant extends Organism {
	constructor(cell: Cell, startEnergy: number = 0) {
		super("plant", "green", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid; 
			if (randomPercentage(1)) {
				gridManager.cloneRandom(this);
			} else {
				gridManager.addToTurnQueue(this);
			}
		}
	}
}

export class Herbivore extends Organism {
	constructor(cell: Cell, startEnergy: number = 50) {
		super("herbivore", "blue", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid;
			let neighbors: Cell[] = gridManager.getNeighbors(this);
			if (this.energy <= 0) {
				gridManager.kill(this);
				return;
			} 
			let plantNeighbors = gridManager.getNeighborsOfType(this, "plant");
			if (plantNeighbors.length > 0) {
				if (this.energy <= 200) {
					this.energy += 5;
					gridManager.moveRandom(this, plantNeighbors);
				} else {
					this.energy /= 2;
					gridManager.cloneRandom(this, plantNeighbors);
				}
				gridManager.addCellsToTurnQueue(neighbors);
			} else {
				this.energy -= 10;
				if (randomPercentage(10)) {
					gridManager.moveRandom(this);
				} else {
					gridManager.addToTurnQueue(this);
				}
			}
		}
	}
}

export class Parasite extends Organism {
	constructor(cell: Cell, startEnergy: number = 10) {
		super("parasite", "red", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid;
			if (this.energy <= 0) {
				gridManager.kill(this);
				return;
			}
			let parasiteNeighbors = gridManager.getNeighborsOfType(this, "parasite", true);
			let plantNeighbors = gridManager.getNeighborsOfType(this, "plant", true);
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