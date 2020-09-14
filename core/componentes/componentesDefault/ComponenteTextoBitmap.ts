import ComponenteBase from '../componenteBase';
import SuscripcionMensaje from '../../mensajes/SuscripcionMensaje';
import TextoBitmap from '../../graficos/textoBitmap';
import Mensaje from '../../mensajes/Mensaje';
import Shader from '../../gl/shader';

/**
 * Componente para poder pintar un texto bitmap.
 * */
export default class ComponenteTextoBitmap extends ComponenteBase implements SuscripcionMensaje {
  public textoBitmap: TextoBitmap;
  public nombreFuente: string;
  public texto: string;

  /**
   * Este mensaje se ejecuta cuando se recibe una suscripcion.
   * @param mensaje Mensaje recibido.
   */
  public recibirMensaje(mensaje: Mensaje): void {
    if (mensaje.codigo === `${this.nombre}:SetText`) {
      this.textoBitmap.texto = String(mensaje.contexto);
    }
  }

  /**
   * Carga en memoria los datos necesarios para el correcto funcionamiento del componente.
   * */
  public cargarConfiguracion(): void {
    this.textoBitmap = new TextoBitmap(this.nombre, this.nombreFuente);

    this.textoBitmap.texto = this.texto;

    Mensaje.suscribirse(`${this.nombre}:SetText`, this);

    this.textoBitmap.cargarConfiguracion();
  }

  /**
   * Actualiza los datos de este componente.
   * @param milisegundos Milisegundos desde la ultima actualizacion.
   */
  public update(milisegundos: number): void {
    this.textoBitmap.update(milisegundos);
  }

  /**
   * Renderiza por pantalla el componente.
   * @param shader Shader de renderizado.
   */
  public render(shader: Shader): void {
    this.textoBitmap.dibujar(shader, this.objetoVirtual.worldMatrix);
    super.render(shader);
  }
}
