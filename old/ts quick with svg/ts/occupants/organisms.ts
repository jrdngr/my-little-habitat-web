function getNeighborsOfType(neighbors: Square[], type: string): Square[] {
	let matchingNeighbors = [];
	for (let i = 0; i < neighbors.length; i++) {
		if (neighbors[i] != null) {
			if (neighbors[i].organism == null && type == null) {
				matchingNeighbors.push(neighbors[i]);
			} else if (neighbors[i].organism != null && neighbors[i].organism.name == type) {
				matchingNeighbors.push(neighbors[i]);
			}
		}
	}
	return matchingNeighbors;
}

class Organism extends Occupant{
	energy: number;
	
	constructor(name, color, startingEnergy?) {
		super(name, color);
		this.energy = startingEnergy || 0;
	}
}

class Wall extends Organism {
	constructor() {
		super("wall", "black");
		this.behavior = function() {};
	}
}

var plantParameters = {
	energyAddedPerTick:	1,
	energyToSplit:		18,
}
class Plant extends Organism {
	constructor() {
		super("plant", "green");
		this.behavior = function(neighbors) {			
			this.energy += plantParameters.energyAddedPerTick;
			if (this.energy >= plantParameters.energyToSplit) {
				this.energy = 0;
				let emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
				if (emptyNeighbors.length > 0) {
					let direction = randomInt(0, emptyNeighbors.length);
					let target = emptyNeighbors[direction];
					target.setOrganism(new Plant());
					target.skip();
				}
			}
		 };
	}
}

var herbivoreParameters = {
	energyLostPerTick:		1,
	energyToSplit:			100,
	energyLostToParasite:		5,
	energyFromVines:			1,
	defaultStartingEnergy:	50
}
class Herbivore extends Organism {
	constructor(startingEnergy?) {
		super("herbivore", "blue");
		this.energy = startingEnergy || herbivoreParameters.defaultStartingEnergy;
		this.behavior = function(neighbors) {
			this.energy -= herbivoreParameters.energyLostPerTick;
			if (this.energy <= 0) {
				neighbors.myself.setOrganism(null);
				return;
			}
			let plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
			if (plantNeighbors.length > 0) {
				let direction = randomInt(0, plantNeighbors.length);
				let target = plantNeighbors[direction];
				if (this.energy > herbivoreParameters.energyToSplit) {
					target.setOrganism(new Herbivore(Math.floor(this.energy/2) + target.organism.energy));
					target.skip();
					neighbors.myself.setOrganism(new Herbivore(Math.floor(this.energy/2)));
				} else {
					target.setOrganism(new Herbivore(this.energy + target.organism.energy));
					target.skip();
					neighbors.myself.setOrganism(null);
				}
				return;				
			}

			let vineNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "vine");
			if (vineNeighbors.length > 0) {
				let direction = randomInt(0, vineNeighbors.length);
				let target = vineNeighbors[direction];
				target.setOrganism(null);
				this.energy += herbivoreParameters.energyFromVines;
				return;				
			}

			let parasiteNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "parasite");
			if (parasiteNeighbors.length > 0) {
				let direction = randomInt(0, parasiteNeighbors.length);
				let target = parasiteNeighbors[direction];
				target.setOrganism(null);
				this.energy -= herbivoreParameters.energyLostToParasite;
				return;				
			}

			let emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
			if (emptyNeighbors.length > 0) {
				let direction = randomInt(0, emptyNeighbors.length);
				let target = emptyNeighbors[direction];
				target.setOrganism(new Herbivore(this.energy - 10));
				target.skip();
				neighbors.myself.setOrganism(null);
			}
		};
	}
}

var parasiteParameters = {
	defaultStartingEnergy:		1,
	parasiteOverpopulation:		5,
	energyLostToOverpopulation:	1,
	gainEnergyIfPopUnder:		6,
	energyAddedPerTick:			1,
	energyToSplit:				50
}
class Parasite extends Organism {
	constructor(startingEnergy?) {
		super("parasite", "red");
		this.energy = startingEnergy || parasiteParameters.defaultStartingEnergy;
		this.behavior =  function(neighbors) {
			if (this.energy <= 0) {
				neighbors.myself.setOrganism(null);
				return;
			}
			let parasiteNeighbors = getNeighborsOfType(neighbors.arr, "parasite");
			let plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
			if (parasiteNeighbors.length >= parasiteParameters.parasiteOverpopulation || plantNeighbors.length == 0) {
				this.energy -= parasiteParameters.energyLostToOverpopulation;
				return;
			} else if (parasiteNeighbors.length < parasiteParameters.gainEnergyIfPopUnder) {
				this.energy += parasiteParameters.energyAddedPerTick;
			}
			if (this.energy > parasiteParameters.energyToSplit) { 
				if (plantNeighbors.length > 0) {
					let direction = randomInt(0, plantNeighbors.length);
					let target = plantNeighbors[direction];
					target.setOrganism(new Parasite(target.organism.energy));
					target.skip();
					neighbors.myself.setOrganism(new Parasite());
					return;				
				}		
			}
		};
	}
}

var vineParameters = {
	defaultStartingEnergy:		0,
	energyAddedPerTick:			1,
	maxVineNeighborsToSplit:	3,
	energyToSplit:				50
}
class Vine extends Organism {
	constructor() {
		super("vine", "purple");
		this.energy = vineParameters.defaultStartingEnergy;
		this.behavior = function(neighbors) {
			let vineNeighbors = getNeighborsOfType(neighbors.arr, "vine");
			if (vineNeighbors.length < vineParameters.maxVineNeighborsToSplit && this.energy > vineParameters.energyToSplit) {
				this.energy = 0;
				if (vineNeighbors.length > 0 ) {
					let direction;
					let neighborArray = neighbors.arr;
					for (let i = 0; i < neighborArray.length; i++) {
						if (neighborArray[i] != null && neighborArray[i].organism != null && neighborArray[i].organism.name == "vine") {
							direction = i + 3;
						}
					}
					direction += randomInt(0, 3);
					direction = direction % 8;
					let target = neighborArray[direction];
					if (target != null && target.organism != null && target.organism.name == "plant") {
						target.setOrganism(new Vine());
						target.skip();
						neighbors.myself.setOrganism(new Vine());
					}
					return;	
				} else {
					let plantNeighbors = getNeighborsOfType(neighbors.arr, "plant");
					if (plantNeighbors.length > 0) {
						let direction = randomInt(0, plantNeighbors.length);
						let target = plantNeighbors[direction];
						target.setOrganism(new Vine());
						target.skip();
						neighbors.myself.setOrganism(new Vine());
						return;	
					}			
				}
			} else {
				this.energy += vineParameters.energyAddedPerTick;
			}
		}
	}
}