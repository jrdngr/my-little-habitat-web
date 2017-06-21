import { GridManager, Cell, Occupant } from "grid";
import { OrganismGridManager } from "organism-grid-manager";
import { randomInt, randomSignedUnit, randomPercentage } from "helpers";

export const getOrganism = function(name: string, cell: Cell): Organism {
	name = name.toLowerCase();
	switch(name) {
		case "plant":
			return new Plant(cell);
		case "herbivore":
			return new Herbivore(cell);
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
			let neighbors: Cell[] = gridManager.getNeighborhood(this);
			if (this.energy <= 0) {
				gridManager.kill(this);
			} else {
				let plantNeighbors = gridManager.getNeighborhoodOfType(this, "plant");
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
					this.energy -= 5;
					if (randomPercentage(10)) {
						gridManager.moveRandom(this);
					} else {
						gridManager.addToTurnQueue(this);
					}
				}
			}
		}
	}
}