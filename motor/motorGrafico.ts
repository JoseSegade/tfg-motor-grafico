import Importadores from './logica/importadores/importadores';
import EventosInput from './sistema/input/eventosInput';
import EscenaControlador from './logica/escena/escenaControlador';
import { CanvasWebGl } from './sistema/gl/canvasWebGl';
import CanalMensaje from './logica/mensajes/canalMensajes';
import Colisiones from './fisica/colision/colisiones';
import Materiales from './graficos/materiales';
import { RecursosLeidos } from './logica/importadores/lectorRecursos';
import Componentes from './logica/componentes/componentes';
import GestorShader from './sistema/gl/gestorShader';

/**
 * MotorGrafico
 * */
export default class MotorGrafico  {
  private _canvas: CanvasWebGl;
  private _previousTime = 0;

  /**
   * Carga los recursos programables
   * @param RecursosLeidos Datos con los que carga los recursos.
   */
  public inicializarRecursosProgramables({
    componentes,
    escenas,
    texturas,
    shaders
  }: RecursosLeidos): void {
    Componentes.guardarComponentes(componentes);
    EscenaControlador.inicializarEscenas(escenas);
    GestorShader.shaders = shaders;
    Materiales.listaTexturas = texturas;
  }  
  
  /**
   * Inicia el motor
   * @param elementName En caso de que se haya creado un canvas, nombre del elemento. 
   */
  public iniciar(elementName?: string, ancho?: number, alto?: number): void {
    console.log('Cargando motor por primera vez...');

    this._canvas = new CanvasWebGl(elementName, ancho, alto);
     
    Importadores.inicializar();
    EventosInput.inicializar(this._canvas.HTMLCanvas);

    GestorShader.crearShaders();    

    this.cargarConfiguracion();
  }
  
  
  public cambiarTamano(anchoVentana: number, altoVentana: number): void {
    const escala = this._canvas.cambiarTamano(anchoVentana, altoVentana);
    EscenaControlador.updateCamara(this._canvas.ancho, this._canvas.alto);
    EventosInput.cambiarResolucion(escala);
  }  
  
  private cargarConfiguracion(): void {
    CanalMensaje.update(0);
    if(!GestorShader.estaCargado()) {
      requestAnimationFrame(this.cargarConfiguracion.bind(this));
    } 
    else {
      GestorShader.usarShaderPorDefecto();
      // TODO: Cambiar escena de manera dinamica
      EscenaControlador.cambiarEscena('ajedrez', () => { EscenaControlador.updateCamara(this._canvas.ancho, this._canvas.alto)});        
      this.loop();
    }
  }

  private loop(): void {
    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }  

  private update(): void {
    const delta: number = performance.now() - this._previousTime;
    CanalMensaje.update(delta);
    EscenaControlador.update(delta);
    Colisiones.update(delta);
    this._previousTime = performance.now();
  }

  private render(): void {
    this._canvas.limpiarBufferColor();
    const shader = GestorShader.shaderPorDefecto;
    this._canvas.subirVecResolucion(shader);
    this._canvas.subirFloatTiempo(shader);
    this._canvas.subirMatricesCamara(shader, EscenaControlador.getMatricesCamara());
    EscenaControlador.render(shader);
  }
}
