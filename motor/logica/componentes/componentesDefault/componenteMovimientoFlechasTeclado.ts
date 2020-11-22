import EventosInput, { FlechasTeclado } from '../../../sistema/input/eventosInput'
import ComponenteBase from '../componenteBase';

/**
 * Utiliza las flechas del teclado para mover la posicion del objeto.
 * */
export class ComponenteMovimientoFlechasTeclado extends ComponenteBase {
    /**
     * Velocidad de movimiento con las teclas.
     */
    public velocidad: number = 0.1;


    /**
     * Actualiza el componente.
     * @param milisegundos Milisegundos transcurridos desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
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

        super.update(milisegundos);
    }
}