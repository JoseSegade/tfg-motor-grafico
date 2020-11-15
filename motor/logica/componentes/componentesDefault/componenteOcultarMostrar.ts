import ComponenteBase from "../componenteBase";
import SuscripcionMensaje from "../../mensajes/suscripcionMensaje";
import Mensaje from "../../mensajes/mensaje";
import ObjetoVirtual from "../../escena/objetoVirtual";

/**
 * Se encarga de ocultar o mostrar los Objetos Virtuales al recibir el mensaje especificado.
 */
export default class ComponenteOcultarMostrar extends ComponenteBase implements SuscripcionMensaje {
    /**
     * True para mostrar / false para ocultar.
     */
     public esVisible: boolean;

     /**
      * Codigo del mensaje al que se suscribira este componente.
      */
     public codigoMensaje: string;

     /**
      * Carga la configuracion necesaria para el correcto funcionamiento.
      */
    public cargarConfiguracion(): void {
        Mensaje.suscribirse(this.codigoMensaje, this);
    }

    /**
     * Funcion ejecutada cuando se recibe un mensaje al que se esta suscrito.
     * @param mensaje Mensaje recibido.
     */
    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === this.codigoMensaje) {
            this.ocultar(this.objetoVirtual, this.esVisible);
        }
    }
    
    /**
     * Oculta / Muestra el ObjetoVirtual especificado y todos sus objetos hijo.
     * @param objetoVirtual Objeto virtual que se quiere modificar.
     * @param visibilidad True para mostrar, false para ocultar.
     */
    public ocultar(objetoVirtual: ObjetoVirtual, visibilidad: boolean): void {
        objetoVirtual.esVisible = visibilidad;
        objetoVirtual.objetosHijo.forEach(obj => this.ocultar(obj, visibilidad));
    }
}