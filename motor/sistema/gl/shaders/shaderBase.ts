import ConstantesError from 'motor/constantes/constantesError';
import ConstantesMensajeria from 'motor/constantes/constantesMensajeria';
import Importadores from 'motor/logica/importadores/importadores';
import RecursoShader from 'motor/logica/importadores/recursos/recursoShader';
import Mensaje from 'motor/logica/mensajes/mensaje';
import SuscripcionMensaje from 'motor/logica/mensajes/suscripcionMensaje';
import Shader from '../shader';

/**
 * Shader basico.
 * */
export default class ShaderBase extends Shader implements SuscripcionMensaje {
  private _shaderVertices: string;
  private _shaderFragmentos: string;

  public constructor( vert: string, frag: string, name?: string) {
    if(!vert || !frag) {
        throw new Error(ConstantesError.ERROR_CREAR_SHADER);
    }
    super(name || 'shaderBase');

    const rutaVert = `/shaders/${vert}`;
    const rutaFrag = `/shaders/${frag}`;
    Importadores.cargarRecurso(rutaVert)
    Importadores.cargarRecurso(rutaFrag);
    Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO + rutaVert, this);
    Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO + rutaFrag, this);
  }

  public recibirMensaje(mensaje: Mensaje) {
    switch (mensaje.codigo) {
        case `${ConstantesMensajeria.RECURSO_CARGADO}/shaders/${this.nombre}.vert`:
            this._shaderVertices = (mensaje.contexto as RecursoShader).datos;
            break;
        case `${ConstantesMensajeria.RECURSO_CARGADO}/shaders/${this.nombre}.frag`:
            this._shaderFragmentos = (mensaje.contexto as RecursoShader).datos;
            break;
        default:
            break;
    }
    if (this._shaderVertices && this._shaderFragmentos && !this.estaCargado) {
      this.cargarConfiguracion(this._shaderVertices, this._shaderFragmentos);
      this._estaCargado = true;
    }
  }
}
