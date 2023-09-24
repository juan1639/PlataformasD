import { 
    constante,
    ctx,
    scroll,
    estado,
    bichoImg,
    marcadores
} from "../constants.js";

import { checkColision } from "../functions.js";

export class Pajaros {
    constructor(w, h, tx, ty) {

        this.direccion = this.elegir_direccion_pajaro(10, w);

        bichoImg.pajaroSsheet.src = './img/bird64x72.png';

        let clipY = 0;

        this.rect = {
            x: this.direccion[0],
            y: this.direccion[2],
            ancho: w,
            alto: h,
            clipY: clipY,
            clipAncho: 64,
            clipAlto: 72
        }

        this.move = {
            velX: this.direccion[3],
            velY: this.direccion[4],
            flip: this.direccion[5],
            aleteo: 0,
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
        this.rect.x += this.move.velX;
        this.rect.y += this.move.velY + scroll.scroll;
        this.move.aleteo = this.aletear();

        if ((this.rect.x >= constante.resolucion[0] && this.move.velX > 0) || (this.rect.x <= -this.rect.ancho && this.move.velX < 0)) {
            estado.pajaros_visibles.shift();
            return;
        }

        if (this.rect.y > Math.floor(constante.resolucion[1])) {
            estado.pajaros_visibles.shift();
            return;
        }
    }

    dibuja() {
        this.actualiza();

        if (bichoImg.pajaroSsheet) {
            ctx.save();

            if (this.move.flip) {
                ctx.translate(this.rect.x + this.rect.ancho, 0);
                ctx.scale(-1, 1);
                ctx.translate(-this.rect.x, 0);
            }

            const nextFrame = this.move.aleteo * this.rect.clipAncho;

            ctx.drawImage(bichoImg.pajaroSsheet, nextFrame, this.rect.clipY, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

            ctx.restore();
        }
    }

    elegir_direccion_pajaro(rango, w) {
        const rnd_direccion = Math.floor(Math.random() * rango);
        const posY = Math.floor(Math.random() * Math.floor(constante.resolucion[1] / 10));

        if (rnd_direccion < 5) {
            return [-w, 0, posY, marcadores.nivel + 1, 0, true];
        }

        return [constante.resolucion[0], 0, posY, -(marcadores.nivel + 1), 0, false];
    }

    aletear() {
        return estado.animaAleteo;
    }
}
