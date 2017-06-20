function getNeighborsOfType(neighbors: Square[], type: string): Square[] {
	let matchingNeighbors = [];
	for (let i = 0; i < neighbors.length; i++) {
		if (neighbors[i] != null) {
			if (neighbors[i].occupant == null && type == null) {
				matchingNeighbors.push(neighbors[i]);
			} else if (neighbors[i].occupant != null && neighbors[i].occupant.name == type) {
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
					target.setOccupant(new Plant());
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
				neighbors.myself.setOccupant(null);
				return;
			}
			let plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
			if (plantNeighbors.length > 0) {
				let direction = randomInt(0, plantNeighbors.length);
				let target = plantNeighbors[direction];
				if (this.energy > herbivoreParameters.energyToSplit) {
					target.setOccupant(new Herbivore(Math.floor(this.energy/2) + (<Organism>target.occupant).energy));
					target.skip();
					neighbors.myself.setOccupant(new Herbivore(Math.floor(this.energy/2)));
				} else {
					target.setOccupant(new Herbivore(this.energy + (<Organism>target.occupant).energy));
					target.skip();
					neighbors.myself.setOccupant(null);
				}
				return;				
			}

			let vineNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "vine");
			if (vineNeighbors.length > 0) {
				let direction = randomInt(0, vineNeighbors.length);
				let target = vineNeighbors[direction];
				target.setOccupant(null);
				this.energy += herbivoreParameters.energyFromVines;
				return;				
			}

			let parasiteNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "parasite");
			if (parasiteNeighbors.length > 0) {
				let direction = randomInt(0, parasiteNeighbors.length);
				let target = parasiteNeighbors[direction];
				target.setOccupant(null);
				this.energy -= herbivoreParameters.energyLostToParasite;
				return;				
			}

			let emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
			if (emptyNeighbors.length > 0) {
				let direction = randomInt(0, emptyNeighbors.length);
				let target = emptyNeighbors[direction];
				target.setOccupant(new Herbivore(this.energy - 10));
				target.skip();
				neighbors.myself.setOccupant(null);
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
				neighbors.myself.setOccupant(null);
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
					target.setOccupant(new Parasite((<Organism>target.occupant).energy));
					target.skip();
					neighbors.myself.setOccupant(new Parasite());
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
						if (neighborArray[i] != null && neighborArray[i].occupant != null && neighborArray[i].occupant.name == "vine") {
							direction = i + 3;
						}
					}
					direction += randomInt(0, 3);
					direction = direction % 8;
					let target = neighborArray[direction];
					if (target != null && target.occupant != null && target.occupant.name == "plant") {
						target.setOccupant(new Vine());
						target.skip();
						neighbors.myself.setOccupant(new Vine());
					}
					return;	
				} else {
					let plantNeighbors = getNeighborsOfType(neighbors.arr, "plant");
					if (plantNeighbors.length > 0) {
						let direction = randomInt(0, plantNeighbors.length);
						let target = plantNeighbors[direction];
						target.setOccupant(new Vine());
						target.skip();
						neighbors.myself.setOccupant(new Vine());
						return;	
					}			
				}
			} else {
				this.energy += vineParameters.energyAddedPerTick;
			}
		}
	}
}