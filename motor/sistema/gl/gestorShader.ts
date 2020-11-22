import ConstantesError from "motor/constantes/constantesError";
import Shader from "./shader";
import ShaderBase from "./shaders/shaderBase";

export default class GestorShader {
  private static _shaders: { [nombre: string]: Shader } = {};
  private static _listaShaders: { [nombre: string]: [string, string] } = {};
  private static _shaderPorDefecto: string;
  private constructor() {}

  /**
   * Devuelve true si todos los shaders estan cargados.
   */
  public static  estaCargado():boolean {
    return Object.values(this._shaders).every((shader) => shader.estaCargado);
  }

  public static set shaders(shaders: { [nombre: string]: [string, string] }) {
    this._listaShaders = shaders;
  }

  /**
   * Guarda cada shader en memoria.
   * @param shaders Diccionario con el nombre de cada shader y la ruta de su respectivo shader de vertices y de fragmentos
   */
  public static crearShaders(){
    if(!Object.keys(this._listaShaders).length) {
      throw new Error(ConstantesError.ERROR_NO_SHADERS);
    }
    
    for (const [clave, valor] of Object.entries(this._listaShaders)) {
      const [ nombre ] = clave.split('.');
      this._shaders[nombre] = new ShaderBase(valor[0], valor[1], nombre);
      if(!this._shaderPorDefecto) {
        this._shaderPorDefecto = nombre;
      }
    }
  }

  /**
   * Utiliza el shader 
   * @param { string= } nombre Nombre del shader que se quiere utilizar por defecto. Si no se anade ninguno se le asigna el primer shader que se haya introducido en memoria.
   */
  public static usarShaderPorDefecto(nombre?: string): void {
    this._shaders[nombre || this._shaderPorDefecto].utilizarShader();
  }

  /**
   * Shader por defecto que se usa.
   */
  public static get shaderPorDefecto(): Shader {
    return this._shaders[this._shaderPorDefecto];
  }
  
}