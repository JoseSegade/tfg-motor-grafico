import Funcionalidad from './Funcionalidad';
import ConstantesError from '../constantes/ConstantesError';

/**
 * Gestiona todos los funcionalidades necesarios para usarse.
 * */
export default class Funcionalidades {

    private static _funcionalidades: { [type: string]: any } = {};

    /**
     * Guarda en memoria los import necesarios para trabajar con ellos.
     * @param funcionalidades Nombres de las funcionalidades existentes. 
     */
    public static guardarfuncionalidades(funcionalidades: string[][]) {
        funcionalidades[0].forEach((c) => {
            const funcionalidad = require(`core/funcionalidades/funcionalidadesDefault/${c}`).default;
            if (funcionalidad) {
                Funcionalidades._funcionalidades[funcionalidad.name] = funcionalidad;
            }
        });
        funcionalidades[1].forEach((c) => {
            const funcionalidad = require(`assets/funcionalidades/${c}`).default;
            if (funcionalidad) {
                Funcionalidades._funcionalidades[funcionalidad.name] = funcionalidad;
            }
        });
    } 

    /**
     * Obtiene el funcionalidad del tipo buscado.
     * @param json Objeto json que contiene la configuracion y el tipo del funcionalidad que se quiere generar.
     */
    public static generarFuncionalidad(json: any): Funcionalidad {
        if (json.tipo) {
            return Object.assign(new Funcionalidades._funcionalidades[json.tipo](), json);
        } else {
            throw new Error(ConstantesError.ERROR_OBTENER_COMPONENTE);
        }
    }
}