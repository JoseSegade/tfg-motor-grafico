import Importadores from '../importadores/Importadores';
import SuscripcionMensaje from '../mensajes/SuscripcionMensaje';
import Nivel from './nivel';
import ConstantesMensajeria from '../constantes/ConstantesMensajeria';
import RecursoJson from '../importadores/recursos/RecursoJson';
import Mensaje from '../mensajes/Mensaje';
import Shader from '../gl/shader';
import ConstantesError from '../constantes/ConstantesError';

/**
 * Gestiona los niveles.
 * Patron singleton.
 * */
export default class NivelManager implements SuscripcionMensaje {
    private static _numeroNiveles: number = -1;
    private static _niveles: { [id: number]: string } = {};
    private static _nivelActual: Nivel;
    private static _instanciaSingleton: NivelManager;

    private constructor() {}

    /**
     * Inicializa el singleton.
     * */
    public static get instancia(): NivelManager {
        if (this._instanciaSingleton === undefined) {
            this._instanciaSingleton = new NivelManager();
        }

        return this._instanciaSingleton;
    }


    public static inicializarNiveles(directorios: string[]): void {
        directorios.forEach((nivelJson) => {
            NivelManager.anadirNivel(`assets/niveles/${nivelJson}`);
        });
    }

    private static anadirNivel(nivel: string) {
        this._niveles[++this._numeroNiveles] = nivel;
    }

    /**
     * Cambia entre los niveles.
     * @param id Id del nivel al que se quiere cambiar.
     */
    public static cambiarNivel(id: number): void {
        console.log('NivelManager: cambiar nivel - _niveles: ', this._niveles);
        if (NivelManager._nivelActual !== undefined) {
            NivelManager._nivelActual = undefined;
        }

        if (NivelManager._niveles[id] !== undefined) {
            if (Importadores.estaRecursoCargadoEnMemoria(NivelManager._niveles[id])) {
                const recurso: RecursoJson = Importadores.obtenerRecurso(
                    NivelManager._niveles[id],
                ) as RecursoJson;
                NivelManager.cargarNivel(recurso);
            } else {
                Mensaje.suscribirse(
                    ConstantesMensajeria.RECURSO_CARGADO + NivelManager._niveles[id],
                    NivelManager._instanciaSingleton,
                );
                Importadores.cargarRecurso(NivelManager._niveles[id]);
            }
        } else {
            throw new Error(ConstantesError.ERROR_ID_NIVEL_INEXISTENTE);
        }
    }

    /**
     * Actualiza el nivel.
     * @param time Tiempo desde la ultima actualizacion.
     */
    public static update(milisegundos: number): void {
        if (NivelManager._nivelActual !== undefined) {
            NivelManager._nivelActual.update(milisegundos);
        }
    }

    /**
     * Renderiza el nivel actual
     * @param shader Shader con el que se renderizara.
     */
    public static render(shader: Shader): void {
        if (NivelManager._nivelActual !== undefined) {
            NivelManager._nivelActual.render(shader);
        }
    }

    /**
     * Funcion que se ejecuta al recibir un mensaje.
     * @param Mensaje Mensaje recibido.
     */
    public recibirMensaje(Mensaje: Mensaje): void {
        if (Mensaje.codigo.indexOf(ConstantesMensajeria.RECURSO_CARGADO) !== -1) {
            const recurso: RecursoJson = Mensaje.contexto as RecursoJson;
            NivelManager.cargarNivel(recurso);
        }
    }

    private static cargarNivel(json: RecursoJson): void {
        const datos = json.datos;

        let idNivel: number;
        if (datos.id === undefined) {
            throw new Error(ConstantesError.ERROR_ID_NIVEL);
        } else {
            idNivel = Number(datos.id);
        }

        let nombreNivel: string;
        if (datos.name === undefined) {
            throw new Error(ConstantesError.ERROR_NOMBRE_NIVEL);
        } else {
            nombreNivel = String(datos.name);
        }

        let descripcionNivel: string;
        if (datos.descripcion !== undefined) {
            descripcionNivel = String(datos.description);
        }

        NivelManager._nivelActual = new Nivel(idNivel, nombreNivel, descripcionNivel);
        NivelManager._nivelActual.inicializar(datos);
        NivelManager._nivelActual.cargarConfiguracion();

        Mensaje.enviar(ConstantesMensajeria.NIVEL_PREPARADO, this);
    }
}
