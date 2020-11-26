import Shader from '../sistema/gl/shader';
import Mensaje from '../logica/mensajes/mensaje';
import SuscripcionMensaje from '../logica/mensajes/suscripcionMensaje';
import RecursoObj from '../logica/importadores/recursos/recursoObj';
import Importadores from '../logica/importadores/importadores';
import ConstantesMensajeria from '../constantes/constantesMensajeria';
import Matrix4x4 from '../fisica/matematicas/matrix4x4';
import ViewProj from '../logica/escena/viewProj';
import Material from './material';
import BufferWebGl from '../sistema/gl/bufferWebGl';
import AttributeInfo from '../sistema/gl/attributeInfo';
import { gl } from '../sistema/gl/canvasWebGl';

export default class MeshBase implements SuscripcionMensaje {
  private _nombre: string;
  private _material: Material;
  private _buffer: BufferWebGl;

  private modelo: number[] = [];
  private _estaCargado = false;

  public constructor(nombre: string) {
    this._nombre = nombre;
    this._estaCargado = false;

    const recursoObj: RecursoObj = Importadores.obtenerRecurso(this._nombre) as RecursoObj;
    if (recursoObj !== undefined) {
      this.inicializarModelo(recursoObj);
    } else {
      Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO + this._nombre, this);
    }
  }

  public get nombre(): string {
    return this._nombre;
  }

  /**
   * Destruye el sprite y libera la memoria.
   * */
  public destroy(): void {
    if (this._buffer) {
      this._buffer.destroy();
    }
  }

  private inicializarModelo(recurso: RecursoObj): void {
    this.cargarModelo(recurso);
    this.cargarAtributos();
  }

  private cargarAtributos(): void {
    const atributoPosicion: AttributeInfo = new AttributeInfo();
    atributoPosicion.cargar(0, 3);

    const atributoCordenadaTextura: AttributeInfo = new AttributeInfo();
    atributoCordenadaTextura.cargar(1, 2);

    const atributoNormal: AttributeInfo = new AttributeInfo();
    atributoNormal.cargar(2, 3);

    this._buffer = new BufferWebGl();
    this._buffer.anadirIdAtributo(atributoPosicion);
    this._buffer.anadirIdAtributo(atributoCordenadaTextura);
    this._buffer.anadirIdAtributo(atributoNormal);
    this._buffer.limpiarBuffer();
    this._buffer.agregarDatos(this.modelo);
    this._buffer.cargarBufferEnWebGl();
    this._buffer.unbind();
  }

  private cargarModelo(recursoObj: RecursoObj): void {
    const coordVertices: number[][] = [];
    const coordTextura: number[][] = [];
    const coordNormal: number[][] = [];
    const indicesVertices = [];
    const indicesTextura = [];
    const indicesNormal = [];
    const lineas = recursoObj.datos.split('\n');
    lineas.forEach((linea) => {
      if (linea.startsWith('#')) {
        return;
      }
      const l = linea.split(' ');
      if (!l.length) {
        return;
      }

      const [identificador, ...valores] = l;
      if (identificador === 'v') {
        coordVertices.push(valores.map((valor) => Number(valor)));
      }
      
      if (identificador === 'vt') {
        coordTextura.push([Number(valores[0]), 1-Number(valores[1])]);
      }

      if (identificador === 'vn') {
        coordNormal.push(valores.map((valor) => Number(valor)));
      }
      if (identificador === 'f') {
        valores.forEach((valor) => {
          const w = valor.split('/');
          indicesVertices.push(Number(w[0]) - 1);
          indicesTextura.push(Number(w[1]) - 1);
          indicesNormal.push(Number(w[2]) - 1);
        });
      }
    });

    indicesVertices.forEach((i, idx) => {
      this.modelo = this.modelo.concat(coordVertices[i]);
      this.modelo = this.modelo.concat(coordTextura[indicesTextura[idx]]);
      this.modelo = this.modelo.concat(coordNormal[indicesNormal[idx]]);
    });
    
    this._estaCargado = true;
  }

  public recibirMensaje(mensaje: Mensaje): void {
    if (mensaje.codigo === ConstantesMensajeria.RECURSO_CARGADO + this._nombre) {
      this.inicializarModelo(mensaje.contexto as RecursoObj);
    }
  }

  public usarMaterial(mat: Material) {
    this._material = mat;
  }
  
  public dibujar(shader: Shader, model: Matrix4x4, viewProj: ViewProj): void {
    if (this._estaCargado) {
      if (viewProj) {
        const { view, proj } = viewProj;

        const modelView = Matrix4x4.multiply(view, model);
        const modelViewProj = Matrix4x4.multiply(proj, modelView);

        const modelViewId: WebGLUniformLocation = shader.obtenerIdentificacion('modelview', true);
        gl.uniformMatrix4fv(modelViewId, false, modelView.toFloat32Array());

        const modelViewProjId: WebGLUniformLocation = shader.obtenerIdentificacion(
          'modelviewproj',
          true,
        );
        gl.uniformMatrix4fv(modelViewProjId, false, modelViewProj.toFloat32Array());
      }      
      const modelId: WebGLUniformLocation = shader.obtenerIdentificacion('model', true);
      gl.uniformMatrix4fv(modelId, false, model.toFloat32Array());

      const colorId: WebGLUniformLocation = shader.obtenerIdentificacion('tint', true);
      gl.uniform4fv(colorId, this._material.color.toFloat32Array());

      if (this._material.texturaDifusa !== undefined) {
        this._material.texturaDifusa.activarYAsociarTextura(0);
        const difId: WebGLUniformLocation = shader.obtenerIdentificacion('diffuse', true);
        gl.uniform1i(difId, 0);
      }

      this._buffer.bind();
      this._buffer.dibujar();
    }
  }
}
