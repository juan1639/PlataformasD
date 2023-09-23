import { 
    constante,
    controles,
    ctx,
    scroll,
    estado,
    jugadorImg,
    sonidos,
    marcadores
} from "../constants.js";

import { 
    checkColision, 
    elNivelSuperado, 
    playSonidos 
} from "../functions.js";

export class Jugador {
    constructor(left, top) {

        jugadorImg.ssheet.src = './img/Ssheet_jugador.png';

        this.plataformaMETA = -999; // Para asegurar que no supere el nivel antes de tiempo

        this.rect = {
            x: left,
            y: top,
            ancho: 80,
            alto: constante.jug_alto,
            clipX: 0,
            clipY: 0,
            clipAncho: 80,
            clipAlto: 110
        }

        this.move = {
            acelX: 0.0,
            velX: 6,
            velY: -20,
            flip: false
        }

        // (Poniendo los 4 atributos = 0 ... sería una colision estricta rectangular)
        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: Math.floor(this.rect.ancho / 3),
            obj2_ver: 0,
        }
    }

    actualiza() {
        // -----------------------------------------------
        //  Lo primero, Resetear siempre (scroll, dx, dy)
        // -----------------------------------------------
        scroll.scroll = 0;
        let dx = 0;
        let dy = 0;
        // -----------------------------------------------

        dx = this.leer_teclado(dx);
        
        this.move.velY += constante.gravedad;
        dy += this.move.velY;

        dx = this.check_limitesHor(dx);
        dy = this.check_colisionPlataformas(dy);
        dy = this.check_caerAlVacio(dy);
        this.check_colision_plataformaMeta();
        scroll.scroll = this.check_scrollThresh(scroll.scroll, dy);

        this.rect.x += dx;
        this.rect.y += dy + scroll.scroll;

        if (this.move.acelX > 0) this.move.acelX --;

        return scroll.scroll;
    }

    dibuja() {
        if (jugadorImg.ssheet) {
            ctx.save();

            if (this.move.flip) {
                ctx.translate(this.rect.x + this.rect.ancho, 0);
                ctx.scale(-1, 1);
                ctx.translate(-this.rect.x, 0);
            }

            if (this.move.velY > 0) {
                ctx.drawImage(jugadorImg.ssheet, 640, 0, this.rect.clipAncho, this.rect.clipAlto, 
                    this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
            
            } else {
                ctx.drawImage(jugadorImg.ssheet, 0, 0, this.rect.clipAncho, this.rect.clipAlto, 
                    this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
            }

            ctx.restore();
        }
    }

    check_colisionPlataformas(dy) {
        for (let plataf of estado.plataformas_visibles) {
            if (checkColision(plataf, this, this.correcciones, dy)) {
                if (this.rect.y + this.rect.alto < plataf.rect.y + Math.floor(plataf.rect.alto / 2)) {
                    if (this.move.velY > 0) {
                        this.rect.y = plataf.rect.y - this.rect.alto;
                        dy = 0;
                        this.move.velY = -20;
                        playSonidos(sonidos.jump, false, 0.4);
                    }
                }
            }
        }

        return dy;
    }

    check_colision_plataformaMeta() {
        // console.log(this.rect.y, this.plataformaMETA);
        if (estado.nivel_superado) return;

        if (this.rect.y + this.rect.alto <= this.plataformaMETA && typeof this.rect.y === 'number' && estado.contador_plataformas >= constante.plataformas_level_up) {

            console.log('nivel superado!');
            estado.nivel_superado = true;
            this.plataformaMETA = -999; // Para asegurar que no supere el nivel antes de tiempo
            playSonidos(sonidos.presentacion, false, 0.6);
            elNivelSuperado();
        }
    }

    check_caerAlVacio(dy) {
        if (estado.actual !== 0) return;

        if (this.rect.y + dy > constante.resolucion[1] * 2) {
            dy = 0;
            estado.actual = 2;  // Game Over
            playSonidos(sonidos.game_over, false, 0.5);
            
            setTimeout(() => {
                estado.actual = 3;  // Post-GameOver Rejugar?
                marcadores.botonNewGame.style.display = 'flex';
                console.log('Game Over!');
            }, 4000);
        }

        return dy;
    }

    check_limitesHor(dx) {
        if (this.rect.x + dx < 0) dx = -this.rect.x;

        if (this.rect.x + this.rect.ancho > constante.resolucion[0]) {
            dx = constante.resolucion[0] - (this.rect.x + this.rect.ancho);
        }

        return dx;
    }

    check_scrollThresh(scrolling, dy) {
        if (this.rect.y <= scroll.scrollThresh && this.move.velY < 0) scrolling = -dy;

        return scrolling;
    }

    leer_teclado(dx) {
        if (controles.touch_izq || controles.tecla_izq) {
            this.move.acelX += 2;
            this.move.flip = true;
            dx = -(this.move.velX + this.move.acelX);

        } else if (controles.touch_dcha || controles.tecla_dcha) {
            this.move.acelX += 2;
            this.move.flip = false;
            dx = this.move.velX + this.move.acelX;
        }

        return dx;
    }
}


