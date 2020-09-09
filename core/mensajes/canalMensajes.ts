import SuscripcionMensaje from "./SuscripcionMensaje";
import ImplementadorMensaje from "./ImplementadorMensaje";
import Mensaje, { PrioridadMensaje } from "./Mensaje";


/**
 * Canal de comunicacion de mensajes entre los diferentes objetos.
 * */
export default class CanalMensaje {

    private static _suscripciones: { [codigo: string]: SuscripcionMensaje[] } = {};

    private static _mensajesPorUpdate: number = 10;
    private static _colaMensajes: ImplementadorMensaje[] = [];

    private constructor() {

    }

    /**
     * Anade una suscripcion a un mensaje determinado.
     * @param codigo Codigo identificatorio a suscribirse.
     * @param suscriptor Suscriptor del mensaje.
     */
    public static agregarSuscripcion(codigo: string, suscriptor: SuscripcionMensaje): void {
        if (CanalMensaje._suscripciones[codigo] === undefined) {
            CanalMensaje._suscripciones[codigo] = [];
        }

        if (CanalMensaje._suscripciones[codigo].indexOf(suscriptor) === -1) {
            CanalMensaje._suscripciones[codigo].push(suscriptor);
        }
    }

    /**
     * Elimina una suscripcion a un mensaje determinado.
     * @param codigo Codigo identificatorio a suscribirse.
     * @param suscriptor Suscriptor del mensaje.
     */
    public static eliminarSuscripcion(codigo: string, suscriptor: SuscripcionMensaje): void {
        if (CanalMensaje._suscripciones[codigo] === undefined) {
            return;
        }

        const idx: number = CanalMensaje._suscripciones[codigo].indexOf(suscriptor);
        if (idx !== -1) {
            CanalMensaje._suscripciones[codigo].splice(idx, 1);
        }
    }

    /**
     * Manda el mensaje al sistema.
     * @param mensaje Mensaje que sera mandado.
     */
    public static enviar(mensaje: Mensaje): void {
        const suscriptores: SuscripcionMensaje[] = CanalMensaje._suscripciones[mensaje.codigo];
        if (suscriptores === undefined) {
            return;
        }

        suscriptores.forEach(suscriptor => {
            if (mensaje.prioridad === PrioridadMensaje.ALTA) {
                suscriptor.recibirMensaje(mensaje);
            }
            else {
                CanalMensaje._colaMensajes.push(new ImplementadorMensaje(mensaje, suscriptor));
            }
        });
    }

    /**
     * Actualiza la cola de suscripcion.
     * @param milisegundos Tiempo desde la ultima actualizacion.
     */
    public static update(_milisegundos: number): void {
        if (CanalMensaje._colaMensajes.length === 0) {
            return;
        }

        const limite: number = Math.min(CanalMensaje._mensajesPorUpdate, CanalMensaje._colaMensajes.length);
        for (let i: number = 0; i < limite; ++i) {
            const nodo: ImplementadorMensaje = CanalMensaje._colaMensajes.pop();
            nodo.subscriptor.recibirMensaje(nodo.mensaje);
        }
    }
}
