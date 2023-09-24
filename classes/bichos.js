import { 
    constante,
    ctx,
    scroll,
    estado,
    bichoImg,
    marcadores
} from "../constants.js";

import { checkColision } from "../functions.js";

export class Bichos {
    constructor(left, top, ancho, w, h, tx, ty) {

        this.ini_recorrido = left * tx;
        this.fin_recorrido = left * tx + ancho * tx;

        bichoImg.ssheet.src = './img/Ssheet_platD.png';

        let clipsXY = this.elegir_bicho_rnd(99);

        this.rect = {
            x: left * tx,
            y: top * ty - h,
            ancho: w,
            alto: h,
            clip: clipsXY,
            clipAncho: 112,
            clipAlto: 72
        }

        this.move = {
            velX: 1,
            velY: 0,
            flip: true,
        }

        // (Poniendo los 4 atributos = 0 ... sería una colision estricta rectangular)
        this.correcciones = {
            obj1_hor: 0,
            obj1_ver: 0,
            obj2_hor: 0,
            obj2_ver: 0,
        }
    }

    actualiza() {
        let dy = 0;

        this.move.velY += constante.gravedad;
        dy += this.move.velY;

        dy = this.check_colisionPlataformas(dy);

        this.rect.x += this.move.velX;
        this.rect.y += dy + scroll.scroll;

        if ((this.rect.x + this.rect.ancho >= this.fin_recorrido && this.move.velX > 0) || (this.rect.x <= this.ini_recorrido && this.move.velX < 0)) {
            this.move.velX *= -1;
            this.move.flip ? this.move.flip = false : this.move.flip = true;
        }

        if (this.rect.y > Math.floor(constante.resolucion[1])) {
            estado.bichos_visibles.shift(); 
        }
    }

    dibuja() {
        this.actualiza();

        if (bichoImg.ssheet) {
            ctx.save();

            if (this.move.flip) {
                ctx.translate(this.rect.x + this.rect.ancho, 0);
                ctx.scale(-1, 1);
                ctx.translate(-this.rect.x, 0);
            }

            if (estado.animas) {
                ctx.drawImage(bichoImg.ssheet, this.rect.clip[0], this.rect.clip[1], this.rect.clipAncho, this.rect.clipAlto, 
                    this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
            
            } else {
                ctx.drawImage(bichoImg.ssheet, this.rect.clip[2], this.rect.clip[3], this.rect.clipAncho, this.rect.clipAlto, 
                    this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
            }

            ctx.restore();
        }
    }

    check_colisionPlataformas(dy) {
        for (let plataf of estado.plataformas_visibles) {
            if (checkColision(plataf, this, this.correcciones, dy)) {
                if (this.rect.y + this.rect.alto + dy > plataf.rect.y) {
                    this.rect.y = plataf.rect.y - this.rect.alto;
                    this.move.velY = 0;
                    dy = 0;
                }
            }
        }

        return dy;
    }

    elegir_bicho_rnd(rango) {
        const rnd_bicho = Math.floor(Math.random() * rango);

        if (rnd_bicho < 30) {
            return [5, 825, 5, 955];
        }

        return [265, 315, 265, 575];
    }
}
