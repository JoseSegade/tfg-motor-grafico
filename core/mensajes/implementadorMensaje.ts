import Mensaje from "./Mensaje";
import SuscripcionMensaje from "./SuscripcionMensaje";

/**
 * Contiene el mensaje y el suscriptor al mismo
 * */
export default class ImplementadorMensaje {
    public mensaje: Mensaje;

    public subscriptor: SuscripcionMensaje;

    public constructor(mensaje: Mensaje, subscriptor: SuscripcionMensaje) {
        this.mensaje = mensaje;
        this.subscriptor = subscriptor;
    }
}
