import {
    estado,
    marcadores,
    controles
} from "./constants.js";

import {
    rejugarNuevaPartida,
    acciones_comunes_nivelSuperado_ReiniciarPartida
} from "./functions.js";

import {
    crea_bucle_principal
} from "./main.js";

// ----------------------------------------------------------------------
//  EVENTOS Touch
// ----------------------------------------------------------------------
let controles_touch = document.addEventListener('touchstart', (event) => {
    // console.log(event.target.id, event.targetTouches, event);
    let touch = event.target.id;

    if (estado.actual === -1) {
        if (touch === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            clearInterval(estado.bucle_prejuego);
            crea_bucle_principal();
        }

    } else if (estado.actual === 3) {
        if (touch === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            rejugarNuevaPartida();
        }
    
    } else if (estado.actual === 0) {
        if (touch === 'boton__le' || touch === 'flecha__le') {
            // console.log('izq...');
            controles.touch_izq = true;
            
        } else if (touch === 'boton__ri' || touch === 'flecha__ri') {
            // console.log('dcha...');
            controles.touch_dcha = true;

        } else {
            console.log('...');
        }
    }

    if (estado.nivel_superado) {
        if (touch === 'boton__NextLevel') {
            estado.nivel_superado = false;
            acciones_comunes_nivelSuperado_ReiniciarPartida();
            marcadores.botonNextLevel.style.display = 'none';
        }
    }
});

document.addEventListener('touchend', (event) => {
    console.log(event.target.id, event.targetTouches);
    let touch = event.target.id;

    if (estado.actual === 0) {
        if (touch === 'boton__le' || touch === 'flecha__le') {
            // console.log('endizq...');
            controles.touch_izq = false;
    
        } else if (touch === 'boton__ri' || touch === 'flecha__ri') {
            // console.log('enddcha...');
            controles.touch_dcha = false;
        } else {
            console.log('... ..');
        }
    }
});

// ----------------------------------------------------------------------
//  EVENTOS Keydown / Keyup
// ----------------------------------------------------------------------
let controles_teclado = document.addEventListener('keydown', (event) => {
    // console.log(event.target.id, event.targetTouches);
    console.log(event.key);
    let pulsacion = event.key;

    if (estado.actual === -1) {
        if (pulsacion === 'Enter') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            clearInterval(estado.bucle_prejuego);
            crea_bucle_principal();
        }

    } else if (estado.actual === 3) {
        if (pulsacion === 'Enter') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            rejugarNuevaPartida();
        }
    
    } else if (estado.actual === 0) {
        if (pulsacion === 'ArrowLeft' || pulsacion === 'ArrowLeft') {
            // console.log('izq...');
            controles.touch_izq = true;
            
        } else if (pulsacion === 'ArrowRight' || pulsacion === 'ArrowRight') {
            // console.log('dcha...');
            controles.touch_dcha = true;

        } else {
            console.log('...');
        }
    }
});

document.addEventListener('keyup', (event) => {
    //console.log(event.target.id, event.targetTouches);

    if (estado.actual === 0) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowLeft') {
            console.log('endizq...');
            controles.touch_izq = false;
    
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowRight') {
            console.log('enddcha...');
            controles.touch_dcha = false;
        } else {
            console.log('... ..');
        }
    }
});

// ----------------------------------------------------------------------
//  EVENTO Click
// ----------------------------------------------------------------------
let controles_click = document.addEventListener('click', (event) => {
    //console.log(event.target.id);

    if (estado.actual === -1) {
        if (event.target.id === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            clearInterval(estado.bucle_prejuego);
            crea_bucle_principal();
        }
    
    } else if (estado.actual === 3) {
        if (event.target.id === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            rejugarNuevaPartida();
        }
    }

    if (estado.nivel_superado) {
        if (event.target.id === 'boton__NextLevel') {
            estado.nivel_superado = false;
            acciones_comunes_nivelSuperado_ReiniciarPartida();
            marcadores.botonNextLevel.style.display = 'none';
        }
    }
});

export { 
    controles_touch,
    controles_teclado,
    controles_click
};
