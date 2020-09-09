import FuncionalidadBase from '../funcionalidadBase';
import SuscripcionMensaje from '../../mensajes/SuscripcionMensaje';
import Mensaje from '../../mensajes/Mensaje';
import ConstantesMensajeria from '../../constantes/ConstantesMensajeria';
import DatosRaton from '../../input/DatosRaton';

/**
 * Manda un mensaje cuando se pulsa click (similar a lo que haria un boton).
 * */
export default class FuncionalidadMensajeAlClick
    extends FuncionalidadBase
    implements SuscripcionMensaje {
    /**
     * Ancho ancho del elemento.
     * */
    public ancho: number;

    /**
     * Alto del elemento.
     * */
    public alto: number;

    /**
     * Codigo del mensaje que se quiere mandar.
     * */
    public codigoMensaje: string;

    /**
     * Carga la informacion necesaria para poder utilizar la funcionalidad de manera correcta.
     * */
    public cargarConfiguracion(): void {
        Mensaje.suscribirse(ConstantesMensajeria.SOLTAR_CLICK, this);
    }

    /**
     * Este metodo se ejecuta cuando llega un mensaje al que se esta suscrito.
     * @param mensaje Mensaje que llega.
     */
    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === ConstantesMensajeria.SOLTAR_CLICK) {
            if (this.objetoVirtual.esVisible) {
                const contexto: DatosRaton = mensaje.contexto as DatosRaton;
                const posicionGlobal = this.objetoVirtual.obtenerPosicionGlobal();
                const x = posicionGlobal.x + this.ancho;
                const y = posicionGlobal.y + this.alto;
                if (
                    contexto.posicion.x >= posicionGlobal.x &&
                    contexto.posicion.x <= x &&
                    contexto.posicion.y >= posicionGlobal.y &&
                    contexto.posicion.y <= y
                ) {
                    Mensaje.enviar(this.codigoMensaje, this);
                }
            }
        }
    }
}
