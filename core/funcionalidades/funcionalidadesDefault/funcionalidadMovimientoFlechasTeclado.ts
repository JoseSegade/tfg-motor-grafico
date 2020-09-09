import EventosInput, { FlechasTeclado } from '../../input/eventosInput'
import FuncionalidadBase from '../funcionalidadBase';

/**
 * Utiliza las flechas del teclado para mover la posicion del objeto.
 * */
export class FuncionalidadMovimientoFlechasTeclado extends FuncionalidadBase {
    public velocidad: number = 0.1;

    public update(time: number): void {
        if (EventosInput.teclaPulsada(FlechasTeclado.IZQUIERDA)) {
            this.objetoVirtual.transform.position.x -= this.velocidad;
        }

        if (EventosInput.teclaPulsada(FlechasTeclado.DERECHA)) {
            this.objetoVirtual.transform.position.x += this.velocidad;
        }

        if (EventosInput.teclaPulsada(FlechasTeclado.ARRIBA)) {
            this.objetoVirtual.transform.position.y -= this.velocidad;
        }

        if (EventosInput.teclaPulsada(FlechasTeclado.ABAJO)) {
            this.objetoVirtual.transform.position.y += this.velocidad;
        }

        super.update(time);
    }
}