import ComponenteBase from '../componenteBase';
import Vector2 from '../../../fisica/matematicas/vector2';
import ConstantesMensajeria from '../../../constantes/constantesMensajeria';
import DatosRaton from '../../../sistema/input/datosRaton';
import Clickable from 'motor/sistema/input/clickable';
import Input from 'motor/sistema/input/input';

/**
 * Permite ejecutar la funcion deseada al clickar en un objeto.
 */
export default abstract class ComponenteClickable  
  extends ComponenteBase
  implements Clickable {
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
    Input.suscribirse(this);
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
   * @param codigo Mensaje que se recibe.
   */
  public notificar(codigo: string, datos: DatosRaton) {
    switch (codigo) {
      case ConstantesMensajeria.PULSAR_CLICK:
        this.click = true;
        this.posRaton.copyFrom(datos.posicion);
        this.alEmpezarClick();
        break;
      case ConstantesMensajeria.SOLTAR_CLICK:
        this.click = false;
        this.posRaton.copyFrom(datos.posicion);
        this.alSoltarClick();
        break;
      case ConstantesMensajeria.MOVER_CLICK:
        if(this.click) {
          this.posRaton.copyFrom(datos.posicion);          
          this.alMoverRaton();
        }
        break;
      default:
        break;
    }
  }
}
