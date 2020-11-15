import ComponenteBase from '../componenteBase';
import SuscripcionMensaje from '../../mensajes/suscripcionMensaje';
import Mensaje from '../../mensajes/mensaje';
import ConstantesMensajeria from '../../../constantes/constantesMensajeria';
import DatosRaton from '../../../sistema/datosRaton';
import Vector2 from '../../../fisica/matematicas/vector2';

/**
 * Manda un mensaje cuando se pulsa click (similar a lo que haria un boton).
 * */
export default class ComponenteMensajeAlClick
  extends ComponenteBase
  implements SuscripcionMensaje {
  /**
   * Esquina superior izquierda respecto a la posicion del objeto padre.
   */
  public origen: Vector2 = Vector2.zero;

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
  public codigosMensaje: string[];

  /**
   * Carga la informacion necesaria para poder utilizar la componente de manera correcta.
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
        const posicionGlobal = new Vector2(
          this.objetoVirtual.obtenerPosicionGlobal().x + this.origen.x,
          this.objetoVirtual.obtenerPosicionGlobal().y + this.origen.y,
        );
        const x = posicionGlobal.x + this.ancho;
        const y = posicionGlobal.y + this.alto;
        if (
          contexto.posicion.x >= posicionGlobal.x &&
          contexto.posicion.x <= x &&
          contexto.posicion.y >= posicionGlobal.y &&
          contexto.posicion.y <= y
        ) {
          this.codigosMensaje.forEach((codigo) => Mensaje.enviar(codigo, this));
        }
      }
    }
  }
}
