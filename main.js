// ----------------------------------------------------------------------------
//  import --> Constantes & variables
// ----------------------------------------------------------------------------
import { 
    constante,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    sonidos,
    plataformasImg
} from "./constants.js";

// ----------------------------------------------------------------------------
//  import --> Objetos clases
// ----------------------------------------------------------------------------
import {
    Plataforma
} from './plataforma.js';

// ----------------------------------------------------------------------------
//  import --> funciones varias
// ----------------------------------------------------------------------------
import {
    dibuja_scrolls,  
    checkColision,
    comprobarNivelSuperado, 
    elNivelSuperado,
    nuevaPartida, 
    elGameOver, 
    mostrarMarcadores,
    reescalaCanvas, 
    borraCanvas, 
    laPresentacion,
    nuevaPartidaLocationReload,
    playSonidos,
    playSonidosLoop,
    reinstanciar_plataformas
} from './functions.js';

window.onload = () => {
    canvas.width = constante.resolucion[0];
    canvas.height = constante.resolucion[1];

    window.columnas = Math.floor(constante.resolucion[0] / constante.bsx);
    window.filas = Math.floor(constante.resolucion[1] / constante.bsy);
    
    scroll.scroll_img.src = './img/fondo_cielo1.png';
    scroll.scroll_img2.src = './img/fondo_cielo2.png';

    let plataforma = new Plataforma(0, filas - 1, 
        columnas + 1, 0, constante.bsx, constante.bsy);
    
    estado.plataformas_visibles.push(plataforma);

    setInterval(() => {
        bucle_principal();
    }, Math.floor(1000 / constante.fps));
}

function bucle_principal() {
    borraCanvas();

    reinstanciar_plataformas();

    dibuja_scrolls(scroll.scroll_img, scroll.scroll_img2);

    for (let i = 0; i < estado.plataformas_visibles.length; i ++) {
        let dibujaPlataforma = estado.plataformas_visibles[i];
        dibujaPlataforma.dibuja();
        // console.log(dibujaPlataforma.rect.x, dibujaPlataforma.rect.y);
    }
}



