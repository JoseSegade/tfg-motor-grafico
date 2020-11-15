import Recurso  from './recursos/recurso';
import Importador from './importador';
import Mensaje from '../mensajes/mensaje';
import ImportadorImagen from './importadorImagen';
import ImportadorJson from './importadorJson';
import ImportadorTxt from './importadorTxt';
import ConstantesMensajeria from '../../constantes/constantesMensajeria';

/**
 * Gestor de los importadores de recursos.
 * */
export default class Importadores {

    private static _importadores: Importador[] = [];
    private static _recursosCargados: { [name: string]: Recurso } = {};

    private constructor() {

    }

    /**
     * Inicializa los posibles importadores de recursos: imagenes, json y textos (Bitmap).
     * */
    public static inicializar(): void {
        Importadores._importadores.push(new ImportadorImagen());
        Importadores._importadores.push(new ImportadorJson());
        Importadores._importadores.push(new ImportadorTxt());
    }

    /**
     * Agrega un importador.
     * @param importador
     */
    public static agregarImportador(importador: Importador): void {
        Importadores._importadores.push(importador);
    }

    /**
     * Se llama cada vez que se termina de cargar un recurso.
     * @param recurso Recurso que se ha terminado de cargar.
     */
    public static recursoCargado(recurso: Recurso): void {
        Importadores._recursosCargados[recurso.nombre] = recurso;
        Mensaje.enviar(ConstantesMensajeria.RECURSO_CARGADO + recurso.nombre, this, recurso);
    }

    /**
     * Cargar recurso.
     * @param nombre Nombre del recurso.
     */
    public static cargarRecurso(nombre: string): void {
        const extension: string = nombre.split('.').pop().trim().toLowerCase();
        for (let l of Importadores._importadores) {
            if (l.extensiones.some(e => e === extension)) {
                l.cargarRecurso(nombre);
                return;
            }
        }
    }

    /**
     * True si el recurso ya se encuentra cargado en memoria.
     * @param nombre Nombre del recurso sobre el que desea conocerse el estado.
     */
    public static estaRecursoCargadoEnMemoria(nombre: string): boolean {
        return Importadores._recursosCargados[nombre] !== undefined;
    }

    /**
     * Devuelve el recurso siempre y cuando este cargado en memoria, en caso contrario devuelve undefined.
     * @param nombre Nombre del recurso.
     */
    public static obtenerRecurso(nombre: string): Recurso {
        if (Importadores._recursosCargados[nombre] !== undefined) {
            return Importadores._recursosCargados[nombre];
        }
        else {
            Importadores.cargarRecurso(nombre);
        }

        return undefined;
    }
}
