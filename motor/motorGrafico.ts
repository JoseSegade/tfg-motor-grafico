import ShaderBase from './graficos/gl/shaders/shaderBase';
import SuscripcionMensaje from './logica/mensajes/suscripcionMensaje';
import Matrix4x4 from './fisica/matematicas/matrix4x4';
import Importadores from './logica/importadores/importadores';
import EventosInput from './sistema/eventosInput';
import EscenaControlador from './logica/escena/escenaControlador';
import WebGl_Util, { gl } from './graficos/gl/gl';
import Vector2 from './fisica/matematicas/vector2';
import Mensaje from './logica/mensajes/mensaje';
import CanalMensaje from './logica/mensajes/canalMensajes';
import Colisiones from './fisica/colision/colisiones';
import Color from './graficos/color';
import FuentesBitmap from './graficos/fuentesBitmap';
import Materiales from './graficos/materiales';
import Material from './graficos/material';
import { RecursosLeidos } from './logica/importadores/lectorRecursos';
import Componentes from './logica/componentes/componentes';

/**
 * MotorGrafico
 * */
export default class MotorGrafico implements SuscripcionMensaje {
  private _canvas: HTMLCanvasElement;
  private _basicShader: ShaderBase;
  private _projection: Matrix4x4;
  private _previousTime: number = 0;

  private _gameWidth: number;
  private _gameHeight: number;

  private _isFirstUpdate: boolean = true;
  private _aspect: number;

  /**
   * Crea un nuevo motor.
   *  @param width The width of the game in pixels.
   *  @param height The height of the game in pixels.
   * */
  public constructor(width?: number, height?: number) {
    this._gameWidth = width;
    this._gameHeight = height;
  }

  /**
   * Carga los recursos programables
   * @param RecursosLeidos Datos con los que carga los recursos.
   */
  public inicializarRecursosProgramables({
    componentes,
    escenas,
  }: RecursosLeidos): void {
    Componentes.guardarComponentes(componentes);
    EscenaControlador.inicializarEscenas(escenas);
  }

  
  /**
   * Inicia el motor
   * @param elementName En caso de que se haya creado un canvas, nombre del elemento. 
   */
  public iniciar(elementName?: string): void {
    this._canvas = WebGl_Util.inicializarWebGl(elementName);
    if (this._gameWidth !== undefined && this._gameHeight !== undefined) {
      this._aspect = this._gameWidth / this._gameHeight;
    }
    Importadores.inicializar();
    EventosInput.inicializar(this._canvas);

    gl.clearColor(0 / 225, 0 / 255, 0 / 255, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this._basicShader = new ShaderBase();
    this._basicShader.utilizarShader();

    FuentesBitmap.agregarFuente('default', '/fonts/default.txt');
    FuentesBitmap.cargarConfiguracion();

    Materiales.agregarMaterial(new Material('tablero', '/textures/tablero.png', Color.blanco));
    Materiales.agregarMaterial(new Material('fichas', '/textures/fichas.png', Color.blanco));
    Materiales.agregarMaterial(new Material('fondo', '/textures/fondo.png', Color.blanco));
    Materiales.agregarMaterial(
      new Material('blancas_seleccion', '/textures/blancas_seleccion.png', Color.blanco),
    );
    Materiales.agregarMaterial(
      new Material('negras_seleccion', '/textures/negras_seleccion.png', Color.blanco),
    );

    this.cambiarTamano(this._gameWidth, this._gameHeight);

    this.precargar();
  }

  /**
   * Cambia el tamano del canvas en caso de que se cambie la ventana.
   * @param anchoVentana Ancho en pixeles de la ventana.
   * @param altoVentana Alto en pixeles de la ventana.
   */
  public cambiarTamano(anchoVentana: number, altoVentana: number): void {
    if (this._canvas !== undefined) {
      if (!this._gameWidth || !this._gameHeight) {
        this._canvas.width = anchoVentana;
        this._canvas.height = altoVentana;
        gl.viewport(0, 0, anchoVentana, altoVentana);
        this._projection = Matrix4x4.ortographic(0, anchoVentana,  altoVentana, 0, -100.0, 100.0);
      } else {
        let newWidth: number = anchoVentana;
        let newHeight: number = altoVentana;
        const newWidthToHeight: number = newWidth / newHeight;
        const gameArea: HTMLElement = document.getElementById('gameArea');

        if (newWidthToHeight > this._aspect) {
          newWidth = newHeight * this._aspect;
        } else {
          newHeight = newWidth * this._aspect;
        }
        gameArea.style.width = `${newWidth}px`;
        gameArea.style.height = `${newHeight}px`;

        gameArea.style.marginLeft = `${-newWidth / 2}px`;
        gameArea.style.marginTop = `${-newHeight / 2}px`;

        this._canvas.width = newWidth;
        this._canvas.height = newHeight;

        gl.viewport(0, 0, newWidth, newHeight);
        this._projection = Matrix4x4.ortographic(
          0,
          this._gameWidth,
          this._gameHeight,
          0,
          -100.0,
          100.0,
        );

        const resolutionScale: Vector2 = new Vector2(
          newWidth / this._gameWidth,
          newHeight / this._gameHeight,
        );
        EventosInput.cambiarResolucion(resolutionScale);
      }
    }
  }

  /**
   * Recibe el mensaje por suscripcion.
   * @param _mensaje Mensaje recibido.
   */
  public recibirMensaje(_mensaje: Mensaje): void {}

  private loop(): void {
    if (this._isFirstUpdate) {
    }

    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  private precargar(): void {
    CanalMensaje.update(0);

    if (!FuentesBitmap.estanActivadas()) {
      requestAnimationFrame(this.precargar.bind(this));
    } else {
      EscenaControlador.cambiarEscena(0);
      this.loop();
    }
  }

  private update(): void {
    const delta: number = performance.now() - this._previousTime;

    CanalMensaje.update(delta);

    EscenaControlador.update(delta);

    Colisiones.update(delta);
    this._previousTime = performance.now();
  }

  private render(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    EscenaControlador.render(this._basicShader);

    const projectionPosition: WebGLUniformLocation = this._basicShader.obtenerIdentificacion(
      'u_projection',
      true,
    );
    gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
  }
}
