import FuncionalidadBase from "../funcionalidadBase";
import SuscripcionMensaje from "../../mensajes/SuscripcionMensaje";
import Mensaje from "../../mensajes/Mensaje";
import ObjetoVirtual from "core/mundo/ObjetoVirtual";

export default class FuncionalidadOcultarMostrar extends FuncionalidadBase implements SuscripcionMensaje {
     public esVisible: boolean;
     public codigoMensaje: string;

    public cargarConfiguracion(): void {
        Mensaje.suscribirse(this.codigoMensaje, this);
    }

    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === this.codigoMensaje) {
            this.ocultar(this.objetoVirtual, this.esVisible);
        }
    }

    public ocultar(objetoVirtual: ObjetoVirtual, visibilidad: boolean): void {
        objetoVirtual.esVisible = visibilidad;
        objetoVirtual.objetosHijo.forEach(obj => this.ocultar(obj, visibilidad));
    }
}