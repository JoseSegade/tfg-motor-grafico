import Matrix4x4 from '../../fisica/matematicas/matrix4x4';
import Vector2 from '../../fisica/matematicas/vector2';
import ConstantesError from '../../constantes/constantesError';
import Shader from './shader';

/**
 * Acceso al contexto de WebGl.
 * */
export let gl: WebGLRenderingContext;

/**
 * Configura el contexto de WebGl. Funcionalidades utiles de WebGL.
 * */
export class CanvasWebGl {
  private _canvas: HTMLCanvasElement;
  private _ancho: number;
  private _alto: number;
  private _proporcion: number;

  public get HTMLCanvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public get ancho(): number {
    return this._ancho;
  }

  public get alto(): number {
    return this._alto;
  }

  /**
   * Inicializa WebGl. En caso de que no se pase id por parametro, creara un nuevo canvas.
   * @param { string } id Id del elemento html que se quiere buscar. Opcional.
   * @param { number } ancho Ancho del canvas. Opcional.
   * @param { number } alto Alto del canvas. Opcional.
   */
  public constructor(id?: string, ancho?: number, alto?: number) {
    const canvas: HTMLCanvasElement = this.crearCanvas(id);

    gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error(ConstantesError.ERROR_INICIALIZAR_WEB_GL);
    }

    this._ancho = ancho;
    this._alto = alto;
    if (ancho !== undefined && alto !== undefined) {
      this._proporcion = this._ancho / this._alto;
    }

    this._canvas = canvas;

    this.limpiarWebGl();
  }

  /**
   * Cambia el tamano del canvas en caso de que se cambie la ventana.
   * @param anchoVentana Ancho en pixeles de la ventana.
   * @param altoVentana Alto en pixeles de la ventana.
   */
  public cambiarTamano(anchoVentana: number, altoVentana: number): Vector2 {
    if (!this._ancho || !this._alto) {
      this._canvas.width = anchoVentana;
      this._canvas.height = altoVentana;
      gl.viewport(0, 0, anchoVentana, altoVentana);
      return new Vector2(anchoVentana, altoVentana);
    } else {
      let newWidth: number = anchoVentana;
      let newHeight: number = altoVentana;
      const newWidthToHeight: number = newWidth / newHeight;
      const gameArea: HTMLElement = document.getElementById('gameArea');
      if (!gameArea) {
        throw new Error(ConstantesError.ERROR_GAME_AREA);
      }

      if (newWidthToHeight > this._proporcion) {
        newWidth = newHeight * this._proporcion;
      } else {
        newHeight = newWidth * this._proporcion;
      }
      gameArea.style.width = `${newWidth}px`;
      gameArea.style.height = `${newHeight}px`;

      gameArea.style.marginLeft = `${-newWidth / 2}px`;
      gameArea.style.marginTop = `${-newHeight / 2}px`;

      this._canvas.width = newWidth;
      this._canvas.height = newHeight;

      gl.viewport(0, 0, newWidth, newHeight);
      return new Vector2(newWidth / this._ancho, newHeight / this._alto);
    }
  }

  public limpiarBufferColor(): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public subirFloatTiempo(shader: Shader): void {
    const iTimeLoc: WebGLUniformLocation = shader.obtenerIdentificacion('iTime', true);
    gl.uniform1f(iTimeLoc, performance.now() / 1000);
  }

  public subirVecResolucion(shader: Shader): void {
    const iResLoc: WebGLUniformLocation = shader.obtenerIdentificacion('iResolution', true);
    gl.uniform3fv(iResLoc, new Float32Array([this.ancho, this.alto, 1]));
  }

  public subirMatrizVista(shader: Shader, matriz: Matrix4x4): void {
    const viewLocation: WebGLUniformLocation = shader.obtenerIdentificacion('view', true);
    gl.uniformMatrix4fv(viewLocation, false, new Float32Array(matriz.data));
  }

  public subirMatrizProyeccion(shader: Shader, matriz: Matrix4x4): void {
    const projectionLocation: WebGLUniformLocation = shader.obtenerIdentificacion(
      'projection',
      true,
    );
    gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(matriz.data));
  }

  public subirMatricesCamara(shader: Shader, viewProj: { view: Matrix4x4; proj: Matrix4x4 }) {
    if (viewProj?.view) {
      this.subirMatrizVista(shader, viewProj.view);
    }

    if (viewProj?.proj) {
      this.subirMatrizProyeccion(shader, viewProj.proj);
    }
  }

  private crearCanvas(id?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;
    if (id !== undefined) {
      canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) {
        throw new Error(ConstantesError.ERROR_INICIALIZAR_WEB_GL);
      }
    } else {
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }
    return canvas;
  }

  private limpiarWebGl(): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(50 / 225, 50 / 255, 50 / 255, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
}
