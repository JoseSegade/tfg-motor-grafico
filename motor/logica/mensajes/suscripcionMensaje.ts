import Mensaje from "./mensaje";

/**
 * Implementa la subscripcion al mensaje
 * */
export default interface SuscripcionMensaje {

    /**
     * Recibe el mensaje mandado.
     * @param mensaje Mensaje mandado
     */
    recibirMensaje(mensaje: Mensaje): void;
}