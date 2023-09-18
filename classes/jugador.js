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

import { checkColision } from "../functions.js";

export class Jugador {
    constructor(left, top) {

        jugadorImg.ssheet.src = './img/Ssheet_jugador.png';

        this.plataformaMETA = -999;

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
    }

    actualiza() {
        // ----------------------------------------------
        //  RESETs (scroll, dx, dy)
        // ----------------------------------------------
        scroll.scroll = 0;
        let dx = 0;
        let dy = 0;
        // ----------------------------------------------

        dx = this.leer_teclado(dx);
        
        this.move.velY += constante.gravedad;
        dy += this.move.velY;

        // dx = this.check_limitesHor(dx);
        dy = this.check_colisionPlataformas(dy);
        dy = this.check_caerAlVacio(dy);
        // this.check_colision_plataformaMeta();
        scroll.scroll = this.check_scrollThresh(scroll.scroll, dy);

        this.rect.x += dx;
        this.rect.y += dy + scroll.scroll;

        if (this.move.acelX > 0) this.move.acelX --;

        return scroll.scroll;
    }

    dibuja() {
        if (estado.actual != 0 && estado.actual != 1) return;

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
        if (estado.actual != 0) return;

        for (let plataf of estado.plataformas_visibles) {
            if (checkColision(plataf, this, 0, dy)) {
                if (this.rect.y + this.rect.alto < plataf.rect.y + Math.floor(plataf.rect.alto / 2)) {
                    if (this.move.velY > 0) {
                        this.rect.y = plataf.rect.y - this.rect.alto;
                        dy = 0;
                        this.move.velY = -20;
                        sonidos.jump.play();
                        sonidos.jump.volume = 0.4;
                    }
                }
            }
        }

        return dy;
    }

    check_caerAlVacio(dy) {
        if (estado.actual != 0) return;

        if (this.rect.y + dy > constante.resolucion[1] * 2) {
            dy = 0;
            estado.actual = 2;  // Game Over
            sonidos.game_over.play();
            sonidos.game_over.volume = 0.5;

            setTimeout(() => {
                estado.actual = 3;  // Post-GameOver Rejugar?
                marcadores.botonNewGame.style.display = 'flex';
                console.log('Game Over!');
            }, 4000);
        }

        return dy;
    }

    check_scrollThresh(scrolling, dy) {
        if (this.rect.y <= scroll.scrollThresh && this.move.velY < 0) scrolling = -dy;

        return scrolling;
    }

    leer_teclado(dx) {
        if (estado.actual != 0) return;

        if (controles.touch_izq) {
            this.move.acelX += 2;
            dx = -(this.move.velX + this.move.acelX);

        } else if (controles.touch_dcha) {
            this.move.acelX += 2;
            dx = this.move.velX + this.move.acelX;
        }

        return dx;
    }
}


