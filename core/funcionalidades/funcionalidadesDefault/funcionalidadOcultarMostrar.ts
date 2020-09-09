import FuncionalidadBase from "../funcionalidadBase";
import SuscripcionMensaje from "../../mensajes/SuscripcionMensaje";
import Mensaje from "../../mensajes/Mensaje";

export default class FuncionalidadOcultarMostrar extends FuncionalidadBase implements SuscripcionMensaje {
     public esVisible: boolean;
     public codigoMensaje: string;

    public cargarConfiguracion(): void {
        Mensaje.suscribirse(this.codigoMensaje, this);
    }

    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === this.codigoMensaje) {
            this.objetoVirtual.esVisible = this.esVisible;
        }
    }
}