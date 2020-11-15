import Importadores from '../importadores/importadores';
import SuscripcionMensaje from '../mensajes/suscripcionMensaje';
import Escena from './escena';
import ConstantesMensajeria from '../../constantes/constantesMensajeria';
import RecursoJson from '../importadores/recursos/recursoJson';
import Mensaje from '../mensajes/mensaje';
import Shader from '../../graficos/gl/shader';
import ConstantesError from '../../constantes/constantesError';

/**
 * Gestiona los Escenas.
 * Patron singleton.
 * */
export default class EscenaControlador implements SuscripcionMensaje {
    private static _numeroEscenas: number = -1;
    private static _escenas: { [id: number]: string } = {};
    private static _escenaActual: Escena;
    private static _instanciaSingleton: EscenaControlador;

    private constructor() {}

    /**
     * Inicializa el singleton.
     * */
    public static get instancia(): EscenaControlador {
        if (this._instanciaSingleton === undefined) {
            this._instanciaSingleton = new EscenaControlador();
        }

        return this._instanciaSingleton;
    }


    public static inicializarEscenas(directorios: string[]): void {
        directorios.forEach((EscenaJson) => {
            EscenaControlador.anadirEscena(`Escenas/${EscenaJson}`);
        });

        Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO, this.instancia);
    }

    private static anadirEscena(Escena: string) {
        this._escenas[++this._numeroEscenas] = Escena;
    }

    /**
     * Cambia entre las escenas.
     * @param id Id de la escena al que se quiere cambiar.
     */
    public static cambiarEscena(id: number): void {
        if (EscenaControlador._escenaActual !== undefined) {
            EscenaControlador._escenaActual = undefined;
        }

        if (EscenaControlador._escenas[id] !== undefined) {
            if (Importadores.estaRecursoCargadoEnMemoria(EscenaControlador._escenas[id])) {
                const recurso: RecursoJson = Importadores.obtenerRecurso(
                    EscenaControlador._escenas[id],
                ) as RecursoJson;
                EscenaControlador.cargarEscena(recurso);
            } else {
                Mensaje.suscribirse(
                    ConstantesMensajeria.RECURSO_CARGADO + EscenaControlador._escenas[id],
                    EscenaControlador._instanciaSingleton,
                );
                Importadores.cargarRecurso(EscenaControlador._escenas[id]);
            }
        } else {
            throw new Error(ConstantesError.ERROR_ID_ESCENA_INEXISTENTE);
        }
    }

    /**
     * Actualiza la escena.
     * @param time Tiempo desde la ultima actualizacion.
     */
    public static update(milisegundos: number): void {
        if (EscenaControlador._escenaActual !== undefined) {
            EscenaControlador._escenaActual.update(milisegundos);
        }
    }

    /**
     * Renderiza la escena actual
     * @param shader Shader con el que se renderizara.
     */
    public static render(shader: Shader): void {
        if (EscenaControlador._escenaActual !== undefined) {
            EscenaControlador._escenaActual.render(shader);
        }
    }

    /**
     * Funcion que se ejecuta al recibir un mensaje.
     * @param Mensaje Mensaje recibido.
     */
    public recibirMensaje(Mensaje: Mensaje): void {
        if (Mensaje.codigo.indexOf(ConstantesMensajeria.RECURSO_CARGADO) !== -1) {
            const recurso: RecursoJson = Mensaje.contexto as RecursoJson;
            EscenaControlador.cargarEscena(recurso);
        }
    }

    private static cargarEscena(json: RecursoJson): void {
        const datos = json.datos;

        let idEscena: number;
        if (datos.id === undefined) {
            throw new Error(ConstantesError.ERROR_ID_ESCENA);
        } else {
            idEscena = Number(datos.id);
        }

        let nombreEscena: string;
        if (datos.nombre === undefined) {
            throw new Error(ConstantesError.ERROR_NOMBRE_ESCENA);
        } else {
            nombreEscena = String(datos.nombre);
        }

        let descripcionEscena: string;
        if (datos.descripcion !== undefined) {
            descripcionEscena = String(datos.descripcion);
        }

        EscenaControlador._escenaActual = new Escena(idEscena, nombreEscena, descripcionEscena);
        EscenaControlador._escenaActual.inicializar(datos);
        EscenaControlador._escenaActual.cargarConfiguracion();

        Mensaje.enviar(ConstantesMensajeria.ESCENA_PREPARADA, this);
    }
}
