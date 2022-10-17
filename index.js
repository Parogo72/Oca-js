const NUM_CASILLAS = 63;
const CASILLA_PARTIDA = 1;
const CASILLA_PUENTE_1 = 6;
const CASILLA_PUENTE_2 = 12;
const CASILLA_DADOS_1 = 26;
const CASILLA_DADOS_2 = 53;
const CASILLA_POSADA = 19;
const CASILLA_PRISION = 52;
const CASILLA_POZO = 31;
const CASILLA_LABERINTO = 42;
const CASILLA_MUERTE = 58;
const TURNOS_POSADA = 1;
const TURNOS_PRISION = 2;
const TURNOS_POZO = 3;
const PENALIZACION_LABERINTO = 12;
const DADO_MAXIMO = 6;
const DADO_MINIMO = 1;
const NUMERO_JUGADORES_MIN = 1;
const NUMERO_JUGADORES_MAX = 2;
const MODO_DEBUGS = true;

class Casilla {
    constructor(num) {
        this.value = num;
    }
    esOca() {
        return (this.value % 9 == 0 || this.value % 9 == 5);
    }
    
    esPuente() {
        return this.value == CASILLA_PUENTE_1 || this.value == CASILLA_PUENTE_2;
    }
    
    esDados() {
        return this.value == CASILLA_DADOS_1 || this.value == CASILLA_DADOS_2;
    }
    
    esLaberinto() {
        return this.value == CASILLA_LABERINTO;
    }
    
    esMuerte() {
        return this.value == CASILLA_MUERTE;
    }
    
    esPosada() {
        return this.value == CASILLA_POSADA;
    }
    
    esPrision() {
        return this.value == CASILLA_PRISION;
    }
    
    esPozo() {
        return this.value == CASILLA_POZO;
    }

    siguienteOca() {
        return this.value + (this.value % 9 == 0 ? 5 : 4);
    }
    
    siguientePuente() {
        return this.value == CASILLA_PUENTE_1 ? CASILLA_PUENTE_2 : CASILLA_PUENTE_1;
    }
    
    siguienteDado() {
        return this.value == CASILLA_DADOS_1 ? CASILLA_DADOS_2 : CASILLA_DADOS_1;
    }
    
    siguienteLaberinto() {
        return this.value - PENALIZACION_LABERINTO;
    }
    
    siguienteMuerte() {
        return CASILLA_PARTIDA;
    }

    efectoCasilla() {
        let newTile = this.value;
        if(this.value === 63) {
            return newTile;
        } else if (this.esOca()) {
			newTile = this.siguienteOca();
			console.log("SALTAS A LA SIGUIENTE OCA EN LA CASILLA: " + newTile);
		}
		else if (this.esPuente()) {
			newTile = this.siguientePuente();
			console.log("DE PUENTE EN PUENTE Y TIRO PORQUE ME LLEVA LA CORRIENTE");
			console.log("SALTAS AL PUENTE EN LA CASILLA: " + newTile);
		}
		else if (this.esDados()) {
			newTile = this.siguienteDado();
			console.log("DE DADO A DADO Y TIRO PORQUE ME HA TOCADO ");
			console.log("SALTAS AL SIGUIENTE DADO EN LA CASILLA: " + newTile);
		}
		else if (this.esLaberinto()) {
			newTile = this.siguienteLaberinto();
			console.log("HAS CAIDO EN EL LABERINTO");
			console.log("RETROCEDES A LA CASILLA " + newTile);
		}
		else if (this.esPosada()) {
			newTile = this.value;
			console.log("HAS CAIDO EN LA POSADA");
		}
		else if (this.esPrision()) {
			newTile = this.value;
			console.log("HAS CAIDO EN LA PRISION");
		}
		else if (this.esPozo()) {
			newTile = this.value;
			console.log("HAS CAIDO EN EL POZO");
		}
		else if (this.esMuerte()) {
			newTile = this.siguienteMuerte();
			console.log("HAS CAIDO EN LA MUERTE");
			console.log("VUELVES A LA CASILLA " + newTile);
		}
        return newTile;
    }

    efectoTiradas() {
        let penalizacion = 0;
        let extra = false;
        if (this.esOca()) {
            extra = true;
        }
        else if (this.esPuente()) {
            extra = true;
        }
        else if (this.esDados()) {
            extra = true;
        }
        else if (this.esPosada()) {
            penalizacion += TURNOS_POSADA;
        }
        else if (this.esPrision()) {
            penalizacion += TURNOS_PRISION;
        }
        else if (this.esPozo()) {
            penalizacion += TURNOS_POZO;
        }
        return { extra, penalizacion }
    }
}

const mapa = new Array(NUM_CASILLAS + 1).fill(1).map((e, i) => new Casilla(i));

class Jugador { 
    constructor(num) {
        this.value = num + 1;
        this.casilla = CASILLA_PARTIDA;
        this.turnosPenalizacion = 0;
        this.mapa = mapa
    }
    win() {
        return this.casilla >= NUM_CASILLAS;
    }
    tirar() {
        if(this.penalizacion) {
            this.penalizacion--;
            return;
        } 
        console.log("CASILLA ACTUAL " + this.casilla);
        const dado = parseInt(Math.random() * (DADO_MAXIMO - DADO_MINIMO) + DADO_MINIMO);
        console.log("VALOR DEL DADO: " + dado)
        this.casilla += dado;
        console.log("PASAS A LA CASILLA " + this.casilla);
        let casillaMapa = this.mapa[this.casilla];
        if(!casillaMapa) return;
        this.casilla = this.mapa[this.casilla].efectoCasilla()
        if(this.casilla >= this.mapa.length - 1) return;
        let tiradas = this.mapa[this.casilla].efectoTiradas()

        if(tiradas.extra) {
            this.tirar();
        }
        this.penalizacion = tiradas.penalizacion;
    }
}


let numJugadores = 3 || prompt("Dame el numero de jugadores", 2);

let jugadores = new Array(numJugadores).fill(1).map((e, i) => new Jugador(i))

let indexJugador = 0;
function main() {
    while(!jugadores.some(e => e.win())) { 
        let jugadorActual = jugadores[indexJugador];
        if(!jugadorActual.penalizacion) {
            console.log("\n" + "TURNO DEL JUGADOR " + jugadorActual.value + "\n");
        }
        jugadorActual.tirar();
        if(!jugadores.some(e => e.win())) {
            if(jugadores.length - 1 === indexJugador) {
                indexJugador = 0;
            } else {
                indexJugador++;
            }
        }
    }
    console.log("HA GANADO EL JUGADOR " + jugadores[indexJugador].value)
}

