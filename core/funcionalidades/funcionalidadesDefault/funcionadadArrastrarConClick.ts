import FuncionalidadBase from '../funcionalidadBase';
import SuscripcionMensaje from 'core/mensajes/suscripcionMensaje';
import Vector2 from 'core/math/vector2';
import Mensaje from 'core/mensajes/Mensaje';
import ConstantesMensajeria from 'core/constantes/ConstantesMensajeria';
import DatosRaton from 'core/input/datosRaton';

/**
 * Permite ejecutar funcionalidad al clickar en un objeto.
 */
export default abstract class FuncionalidadArrastrarConClick
  extends FuncionalidadBase
  implements SuscripcionMensaje {
  private click: boolean = false;

  /**
   * Ultima posicion del raton.
   */
  protected posRaton: Vector2 = Vector2.zero;

  /**
   * Carga la configuracion necesaria para el correcto funcionamiento del objeto.
   */
  public cargarConfiguracion(): void {
    this.click = false;
    Mensaje.suscribirse(ConstantesMensajeria.PULSAR_CLICK, this);
    Mensaje.suscribirse(ConstantesMensajeria.SOLTAR_CLICK, this);
    Mensaje.suscribirse(ConstantesMensajeria.MOVER_CLICK, this);
  }

  /**
   * Funcion que se ejecuta cuando el click es iniciado.
   */
  public alEmpezarClick(): void {}

  /**
   * Funcion que se ejecuta cuando se suelta click.
   */
  public alSoltarClick(): void {}

  /**
   * Funcion que se ejecuta mientras se arrastra el raton.
   */
  public alMoverRaton(): void {}

  /**
   * Recibe el mensaje al que se esta suscrito.
   * @param mensaje Mensaje que se recibe.
   */
  public recibirMensaje(mensaje: Mensaje) {
    switch (mensaje.codigo) {
      case ConstantesMensajeria.PULSAR_CLICK:
        this.click = true;
        this.posRaton.copyFrom((mensaje.contexto as DatosRaton).posicion);
        this.alEmpezarClick();
        break;
      case ConstantesMensajeria.SOLTAR_CLICK:
        this.click = false;
        this.posRaton.copyFrom((mensaje.contexto as DatosRaton).posicion);
        this.alSoltarClick();
        break;
      case ConstantesMensajeria.MOVER_CLICK:
        if(this.click) {
          this.posRaton.copyFrom((mensaje.contexto as DatosRaton).posicion);          
          this.alMoverRaton();
        }
        break;
      default:
        break;
    }
  }
}
