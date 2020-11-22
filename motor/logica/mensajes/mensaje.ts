import CanalMensaje from "./canalMensajes";
import SuscripcionMensaje from "./suscripcionMensaje";

/**
 * Mensaje que se envia de un objeto a otro.
 * */
export default class Mensaje {

    /**
     * Codigo identificatorio del mensaje.
     * */
    public codigo: string;

    /**
     * Contexto de envio.
     * */
    public contexto: any;

    /**
     * Referencia al objeto que envia el mensaje.
     * */
    public remitente: any;

    /**
     * Crea un nuevo mensaje.
     * @param codigo Codigo identificatorio del mensaje.
     * @param remitente Referencia al objeto que envia el mensaje.
     * @param contexto Contexto de envio. Opcional.
     */
    public constructor(codigo: string, remitente: any, contexto?: any) {
        this.codigo = codigo;
        this.remitente = remitente;
        this.contexto = contexto;
    }

    /**
     * Envia el mensaje.
     * @param codigo  Codigo identificatorio del mensaje.
     * @param remitente Referencia al objeto que envia el mensaje.
     * @param contexto Contexto de envio. Opcional.
     */
    public static enviar(codigo: string, remitente: any, contexto?: any): void {
        CanalMensaje.enviar(new Mensaje(codigo, remitente, contexto));
    }

    /**
     * Crea una subscripcion al mensaje.
     * @param codigo Codigo identificatorio del mensaje.
     * @param subscriptor Objeto subscriptor del mensaje.
     */
    public static suscribirse(codigo: string, subscriptor: SuscripcionMensaje): void {
        CanalMensaje.agregarSuscripcion(codigo, subscriptor);
    }

    /**
     * Elimina una subscripcion al mensaje.
     * @param codigo Codigo identificatorio del mensaje.
     * @param subscriptor Objeto subscriptor del mensaje.
     */
    public static desuscribirse(codigo: string, suscriptor: SuscripcionMensaje): void {
        CanalMensaje.eliminarSuscripcion(codigo, suscriptor);
    }
}
