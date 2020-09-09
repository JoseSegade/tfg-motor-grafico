import Funcionalidad from './Funcionalidad';
import ConstantesError from '../constantes/ConstantesError';

/**
 * Gestiona todos las funcionalidades necesarias para usarse.
 * */
export default class Funcionalidades {

    private static _funcionalidades: { [type: string]: any } = {};

    public static guardarfuncionalidades(funcionalidades: string[]) {
        funcionalidades.forEach((c) => {
            const funcionalidad = require(`core/funcionalidades/funcionalidadesDefault/${c}`).default;
            if (funcionalidad) {
                Funcionalidades._funcionalidades[funcionalidad.name] = funcionalidad;
            }
        });
    } 

    /**
     * Obtiene la funcionalidad del tipo buscado.
     * @param json Objeto json que contiene la configuracion y el tipo del componente que se quiere generar.
     */
    public static generarFuncionalidad(json: any): Funcionalidad {
        if (json.tipo) {
            return Object.assign(new Funcionalidades._funcionalidades[json.type], json);
        }
        else {
            throw new Error(ConstantesError.ERROR_OBTENER_COMPONENTE)
        }
    }
}