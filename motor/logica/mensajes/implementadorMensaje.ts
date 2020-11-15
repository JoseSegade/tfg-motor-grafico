import Mensaje from "./mensaje";
import SuscripcionMensaje from "./suscripcionMensaje";

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
