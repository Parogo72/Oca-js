const TilesNumber = 63;
const StartingTile = 1;
const BridgeTile1 = 6;
const BridgeTile2 = 12;
const DiceTile1 = 26;
const DiceTile2 = 53;
const IncTile = 19;
const PrisonTile = 52;
const WellTile = 31;
const MazeTile = 42;
const DeathTile = 58;
const IncPenalty = 1;
const PrisonPenalty = 2;
const WellPenalty = 3;
const MazePenalty = 12;
const MaxDice = 6;
const MinDice = 1;

class Tile {
    constructor(num) {
        this.value = num;
    }
    isGoose() {
        return (this.value % 9 == 0 || this.value % 9 == 5);
    }
    
    isBridge() {
        return this.value == BridgeTile1 || this.value == BridgeTile2;
    }
    
    isDice() {
        return this.value == DiceTile1 || this.value == DiceTile2;
    }
    
    isMaze() {
        return this.value == MazeTile;
    }
    
    isDeath() {
        return this.value == DeathTile;
    }
    
    isInc() {
        return this.value == IncTile;
    }
    
    isPrison() {
        return this.value == PrisonTile;
    }
    
    isWell() {
        return this.value == WellTile;
    }

    nextGoose() {
        return this.value + (this.value % 9 == 0 ? 5 : 4);
    }
    
    nextBridge() {
        return this.value == BridgeTile1 ? BridgeTile2 : BridgeTile1;
    }
    
    nextDice() {
        return this.value == DiceTile1 ? DiceTile2 : DiceTile1;
    }
    
    nextMaze() {
        return this.value - MazePenalty;
    }
    
    nextDeath() {
        return StartingTile;
    }

    tileEffect() {
        let newTile = this.value;
        if(this.value === 63) {
            return newTile;
        } else if (this.isGoose()) {
			newTile = this.nextGoose();
			console.log("SALTAS A LA SIGUIENTE OCA EN LA CASILLA: " + newTile);
		}
		else if (this.isBridge()) {
			newTile = this.nextBridge();
			console.log("DE PUENTE EN PUENTE Y TIRO PORQUE ME LLEVA LA CORRIENTE");
			console.log("SALTAS AL PUENTE EN LA CASILLA: " + newTile);
		}
		else if (this.isDice()) {
			newTile = this.nextDice();
			console.log("DE DADO A DADO Y TIRO PORQUE ME HA TOCADO ");
			console.log("SALTAS AL SIGUIENTE DADO EN LA CASILLA: " + newTile);
		}
		else if (this.isMaze()) {
			newTile = this.nextMaze();
			console.log("HAS CAIDO EN EL LABERINTO");
			console.log("RETROCEDES A LA CASILLA " + newTile);
		}
		else if (this.isInc()) {
			newTile = this.value;
			console.log("HAS CAIDO EN LA POSADA");
		}
		else if (this.isPrison()) {
			newTile = this.value;
			console.log("HAS CAIDO EN LA PRISION");
		}
		else if (this.isWell()) {
			newTile = this.value;
			console.log("HAS CAIDO EN EL POZO");
		}
		else if (this.isDeath()) {
			newTile = this.nextDeath();
			console.log("HAS CAIDO EN LA MUERTE");
			console.log("VUELVES A LA CASILLA " + newTile);
		}
        return newTile;
    }

    throwEffect() {
        let penalty = 0;
        let extra = false;
        if (this.isGoose()) {
            extra = true;
        }
        else if (this.isBridge()) {
            extra = true;
        }
        else if (this.isDice()) {
            extra = true;
        }
        else if (this.isInc()) {
            penalty += IncPenalty;
        }
        else if (this.isPrison()) {
            penalty += PrisonPenalty;
        }
        else if (this.isWell()) {
            penalty += WellPenalty;
        }
        return { extra, penalty }
    }
}



class Player { 
    constructor(num, map) {
        this.value = num + 1;
        this.tile = StartingTile;
        this.turnosPenalizacion = 0;
        this.map = map
    }
    win() {
        return this.tile >= TilesNumber;
    }
    throw() {
        if(this.penalty) {
            this.penalty--;
            return;
        } 
        console.log("CASILLA ACTUAL " + this.tile);
        const dice = parseInt(Math.random() * (MaxDice - MinDice) + MinDice);
        console.log("VALOR DEL DADO: " + dice)
        this.tile += dice;
        console.log("PASAS A LA CASILLA " + this.tile);
        let tileMap = this.map[this.tile];
        if(!tileMap) return;
        this.tile = this.map[this.tile].tileEffect()
        if(this.tile >= this.map.length - 1) return;
        let throws = this.map[this.tile].throwEffect()

        if(throws.extra) {
            this.throw();
        }
        this.penalty = throws.penalty;
    }
}



function main() {
    let numPlayers = 7 || prompt("Dame el numero de players", 2);
    const map = new Array(TilesNumber + 1).fill(1).map((e, i) => new Tile(i));
    let players = new Array(numPlayers).fill(1).map((e, i) => new Player(i, map))
    let indexPlayer = 0;
    while(!players.some(e => e.win())) { 
        let mainPlayer = players[indexPlayer];
        if(!mainPlayer.penalty) {
            console.log("\n" + "TURNO DEL JUGADOR " + mainPlayer.value + "\n");
        }
        mainPlayer.throw();
        if(!players.some(e => e.win())) {
            if(players.length - 1 === indexPlayer) {
                indexPlayer = 0;
            } else {
                indexPlayer++;
            }
        }
    }
    console.log("HA GANADO EL JUGADOR " + players[indexPlayer].value)
}
