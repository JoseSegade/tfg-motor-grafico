import Componente from './componente';
import ConstantesError from '../constantes/ConstantesError';

/**
 * Gestiona todos los componentes necesarios para usarse.
 * */
export default class Componentes {

    private static _componentes: { [type: string]: any } = {};

    public static guardarComponentes(componentes: string[][]) {
        componentes[0].forEach((c) => {
            const componente = require(`core/componentes/componentesDefault/${c}`).default;
            if (componente) {
                Componentes._componentes[componente.name] = componente;
            }
        });
        componentes[1].forEach((c) => {
            const componente = require(`assets/componentes/${c}`).default;
            if (componente) {
                Componentes._componentes[componente.name] = componente;
            }
        });
    } 

    /**
     * Obtiene el componente del tipo buscado.
     * @param json Objeto json que contiene la configuracion y el tipo del componente que se quiere generar.
     */
    public static generarComponente(json: any): Componente {
        if (json.tipo) {     
            console.log(json.tipo);        
            return Object.assign(new Componentes._componentes[json.tipo](), json);
        } else {
            throw new Error(ConstantesError.ERROR_OBTENER_COMPONENTE);
        }
    }
}


