import {
    constante,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    colores,
    sonidos,
    pos_ini_jugador,
    controles
} from './constants.js';

import {
    Plataforma
} from './classes/plataforma.js';

import {
    Bichos
} from './classes/bichos.js';

import {
    Pajaros
} from './classes/pajaros.js';

// ----------------------------------------------------------------------------
//  Funciones varias
// ----------------------------------------------------------------------------
function dibuja_scrolls(img1, img2) {
    const resY = constante.resolucion[1];
    scroll.bgScroll += scroll.scroll;

    if (scroll.bgScroll >= resY * 2) scroll.bgScroll = 0;

    ctx.drawImage(img1, 0, 0 + scroll.bgScroll);
    ctx.drawImage(img2, 0, 0 - resY + scroll.bgScroll);
    ctx.drawImage(img1, 0, 0 - resY * 2 + scroll.bgScroll);
    ctx.drawImage(img2, 0, 0 - resY * 3 + scroll.bgScroll);
}

// ----------------------------------------------------------------------------
function dibuja_plataformas() {
    const nro_plataformas = estado.plataformas_visibles.length;

    for (let i = 0; i < nro_plataformas; i ++) {
        let dibujaPlataforma = estado.plataformas_visibles[i];
        if (dibujaPlataforma) dibujaPlataforma.dibuja();
        // console.log(dibujaPlataforma.rect.x, dibujaPlataforma.rect.y);
    }
}

// ----------------------------------------------------------------------------
function reinstanciar_plataformas() {
    const cont = estado.contador_plataformas;
    const topP = constante.plataformas_level_up;

    if (estado.plataformas_visibles.length < constante.max_plataformas && cont < topP) {
        estado.contador_plataformas ++;
        console.log('cont_plat:', estado.contador_plataformas);


        let ancho;
        let x;
        const valor = constante.ancho_plataf_nivel[marcadores.nivel - 1];
        const columnas = Math.floor(constante.resolucion[0] / constante.bsx);

        if (estado.contador_plataformas === topP) {
            ancho = columnas + 3;
            x = 0;
        
        } else {
            x = Math.floor(Math.random() * (columnas - 2));

            if (marcadores.nivel < 9) {
                ancho = Math.floor(Math.random() * (valor[1] - valor[0])) + 2;

            } else {
                ancho = Math.floor(Math.random() * 2) + 2;
            }
        }

        const indiceUltimaPlat = estado.plataformas_visibles.length - 1;
        const ultimaPlataforma = Math.floor(estado.plataformas_visibles[indiceUltimaPlat].rect.y / constante.bsy);
        const espacioEntrePlataformas = Math.floor(Math.random() * 2) + 2;
        const y = ultimaPlataforma - espacioEntrePlataformas;

        if (estado.contador_plataformas === topP) objeto.jugador.plataformaMETA = y;

        let velX_rnd;
        const num_rnd = Math.floor(Math.random() * 99);
        console.log(num_rnd);

        if (num_rnd <= marcadores.nivel * 9 && ancho < columnas - 2) {
            velX_rnd = marcadores.nivel + 1;
            if (x > columnas / 2) x = Math.floor(columnas / 2);

        } else {
            velX_rnd = 0;
        }

        let plataforma = new Plataforma(x, y, ancho, velX_rnd, constante.bsx, constante.bsy);
        estado.plataformas_visibles.push(plataforma);

        // ---------------------------------------------------------------
        reinstanciar_pajaros();
        if (velX_rnd === 0 && ancho > 2) reinstanciar_bichosEnPlataformas(x, y, ancho);
    }
}

// --------------------------------------------------------------------------
//  Reinstanciar bichos en plataformas
// --------------------------------------------------------------------------
function reinstanciar_bichosEnPlataformas(x, y, ancho) {
    const num_rnd = Math.floor(Math.random()* 99);

    if (num_rnd > 7 + marcadores.nivel * 4) return;

    const sizeX_bicho = 70;
    const sizeY_bicho = 40;

    let bicho = new Bichos(x, y, ancho, sizeX_bicho, sizeY_bicho, constante.bsx, constante.bsy);
    estado.bichos_visibles.push(bicho);
}

// --------------------------------------------------------------------------
//  Dibuja Bichos
// --------------------------------------------------------------------------
function dibuja_bichos() {
    const nro_bichos= estado.bichos_visibles.length;

    for (let i = 0; i < nro_bichos; i ++) {
        let dibujaBicho = estado.bichos_visibles[i];
        if (dibujaBicho) dibujaBicho.dibuja();
        // console.log(dibujaBicho.rect.x, dibujaBicho.rect.y);
    }
}

// --------------------------------------------------------------------------
//  Reinstanciar pajaros
// --------------------------------------------------------------------------
function reinstanciar_pajaros() {
    const num_rnd = Math.floor(Math.random()* 99);

    if (num_rnd > 7 + marcadores.nivel * 4) return;

    const sizeX_pajaro = 80;
    const sizeY_pajaro = 90;

    let pajaro = new Pajaros(sizeX_pajaro, sizeY_pajaro, constante.bsx, constante.bsy);
    estado.pajaros_visibles.push(pajaro);
}

// --------------------------------------------------------------------------
//  Dibuja Pajaros
// --------------------------------------------------------------------------
function dibuja_pajaros() {
    const nro_pajaros = estado.pajaros_visibles.length;

    for (let i = 0; i < nro_pajaros; i ++) {
        let dibujaPajaro = estado.pajaros_visibles[i];
        if (dibujaPajaro) dibujaPajaro.dibuja();
        // console.log(dibujaBicho.rect.x, dibujaBicho.rect.y);
    }
}

// --------------------------------------------------------------------------
//  Funcion para checkear colisiones entre objetos (parametros obj1 y obj2)
// --------------------------------------------------------------------------
function checkColision(obj1, obj2, corr, dy) {
    return obj1.rect.x + corr.obj1_hor < obj2.rect.x + obj2.rect.ancho - corr.obj2_hor && 
            obj1.rect.x + obj1.rect.ancho - corr.obj1_hor > obj2.rect.x + corr.obj2_hor &&
            obj1.rect.y + corr.obj1_ver < obj2.rect.y + dy + obj2.rect.alto - corr.obj2_ver && 
            obj1.rect.y + obj1.rect.alto - corr.obj1_ver > obj2.rect.y + dy + corr.obj2_ver;
}

// --------------------------------------------------------------------------
function elNivelSuperado() {
    
    setTimeout(() => {
        marcadores.nivel ++;
        marcadores.scoreNivel.innerHTML = `Nivel: ${marcadores.nivel}`;
        marcadores.botonNextLevel.style.display = 'flex';
    }, 5800);
}

// ---------------------------------------------------------------------
function rejugarNuevaPartida() {
    marcadores.puntos = 0;
    marcadores.scorePtos.innerHTML = `Puntos: ${marcadores.puntos}`;
    marcadores.nivel = 1;
    marcadores.scoreNivel.innerHTML = `Nivel: ${marcadores.nivel}`;
    marcadores.vidas = 3;
    marcadores.scoreVidas.innerHTML = `Vidas: ${marcadores.vidas}`;

    acciones_comunes_nivelSuperado_ReiniciarPartida();
}

// -------------------------------------------------------------------------
function acciones_comunes_nivelSuperado_ReiniciarPartida() {
    const noche = Math.floor(Math.random() * 99);

    if (marcadores.nivel > 1 && noche < 20) {
        scroll.scroll_img.src = './img/fondo_noche1.png';
        scroll.scroll_img2.src = './img/fondo_noche2.png';

    } else {
        scroll.scroll_img.src = './img/fondo_cielo1.png';
        scroll.scroll_img2.src = './img/fondo_cielo2.png';
    }

    objeto.jugador.rect.x = pos_ini_jugador.x;
    objeto.jugador.rect.y = pos_ini_jugador.y;
    objeto.jugador.move.acelX = 0.0;
    objeto.jugador.move.velY = -20;

    estado.bichos_visibles = [];
    estado.plataformas_visibles = [];
    estado.contador_plataformas = 0;

    controles.touch_dcha = false;
    controles.touch_izq = false;

    const columnas = Math.floor(constante.resolucion[0] / constante.bsx);
    const filas = Math.floor(constante.resolucion[1] / constante.bsy);

    let plataforma = new Plataforma(0, filas - 1, 
        columnas + 1, 0, constante.bsx, constante.bsy);
    
    estado.plataformas_visibles.push(plataforma);
}

// -------------------------------------------------------------------------
function elGameOver() {
    if (estado.actual !== 3) return;

    const gradi = ctx.createLinearGradient(Math.floor(constante.resolucion[0] / 5) + 5, 
        Math.floor(constante.resolucion[1] / 4), Math.floor(constante.resolucion[0] / 5) + 5, 
        Math.floor(constante.resolucion[1] / 1.5));
    gradi.addColorStop(0, 'orangered');
    gradi.addColorStop(1, 'yellow');

    ctx.font = '120px seriff';
    ctx.textAlign = 'center';
    ctx.fillStyle = gradi;
    ctx.fillText('Game Over', Math.floor(constante.resolucion[0] / 2), 
        Math.floor(constante.resolucion[1] / 2));
}

// ------------------------------------------------------------------------
function mostrarMarcadores() {
    if (estado.actual == 0) {

        const gradi = ctx.createLinearGradient(parseInt(resolucion[0] / 5) + 5, 
            parseInt(resolucion[1] / 4), parseInt(resolucion[0] / 5) + 5, parseInt(resolucion[1] / 1.5));
        gradi.addColorStop(0, 'orangered');
        gradi.addColorStop(1, 'yellow');

        ctx.font = '100px seriff';
        ctx.fillStyle = gradi;
        ctx.fillText('Preparado!', parseInt(resolucion[0] / 5) + 5, 
            parseInt(resolucion[1] / 2));
    }

    if (estado.actual == 3) {
        ctx.font = '100px seriff';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Nivel Superado!', parseInt(resolucion[0] / 9) + 5, 
            parseInt(resolucion[1] / 2));
    }

    objeto.fantasma.forEach(fant => {
        if (fant.showPtos) {
            ctx.save();
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 10;
            ctx.font = '30px seriff';
            ctx.fillStyle = 'orangered';
            ctx.fillText(fant.showx2, fant.showX, fant.showY);
            ctx.restore();
        }
    });

    if (objeto.fruta.showPtos) {
        ctx.save();
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 10;
        ctx.font = '32px seriff';
        ctx.fillStyle = 'orangered';
        ctx.fillText(estadoFantasmas.ptosComeFruta, objeto.fruta.showX, objeto.fruta.showY);
        ctx.restore();
    }
}

// ------------------------------------------------------------------------
function playSonidos(sonido, loop, volumen) {
    sonido.play();
    sonido.loop = loop;
    sonido.volume = volumen;
}

// ------------------------------------------------------------------------
function reescalaCanvas() {
    return;
}

// ------------------------------------------------------------------------
function borraCanvas() {
    // canvas.width = canvas.width;
    // canvas.height = canvas.height;
    ctx.fillStyle = colores.azul_fondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//========================================================================
// Presentacion / Menu Principal
//------------------------------------------------------------------------
function laPresentacion(animaPacMan) {
    ctx.font = '120px seriff';
    ctx.fillStyle = 'orangered';
    ctx.fillText('Pac Clon', parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 2));

    ctx.font = '30px seriff';
    ctx.fillStyle = 'white';
    ctx.fillText('Pulse INTRO o Nueva Partida para comenzar...', parseInt(resolucion[0] / 9) + 5, 
        resolucion[1] - constante.bsy * 2);

    objeto.pacman.secuenciaPresentacion(animaPacMan);
    objeto.fantasma[1].secuenciaPresentacion();
}

export {
	checkColision, 
    elNivelSuperado,
    acciones_comunes_nivelSuperado_ReiniciarPartida,
	rejugarNuevaPartida, 
    elGameOver, 
    mostrarMarcadores,
	reescalaCanvas, 
    borraCanvas, 
    laPresentacion,
    playSonidos, 
    dibuja_scrolls,
    reinstanciar_plataformas, 
    dibuja_plataformas,
    dibuja_bichos,
    dibuja_pajaros
};

