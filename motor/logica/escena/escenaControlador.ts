import Importadores from '../importadores/importadores';
import SuscripcionMensaje from '../mensajes/suscripcionMensaje';
import Escena from './escena';
import ConstantesMensajeria from '../../constantes/constantesMensajeria';
import RecursoJson from '../importadores/recursos/recursoJson';
import Mensaje from '../mensajes/mensaje';
import Shader from '../../sistema/gl/shader';
import ConstantesError from '../../constantes/constantesError';
import ViewProj from './viewProj';

/**
 * Gestiona los Escenas.
 * Patron singleton.
 * */
export default class EscenaControlador implements SuscripcionMensaje {
    private static _numeroEscenas: number = -1;
    private static _escenas: { [id: string]: string } = {};
    private static _escenaActual: Escena;
    private static _instanciaSingleton: EscenaControlador;
    private static _escenaCargada: boolean;
    private static _alCargar: () => void;

    private constructor() {}

    public static get escenaCargada() : boolean {
        return this._escenaCargada;
    }

    /**
     * Inicializa el singleton.
     * */
    public static get instancia(): EscenaControlador {
        if (this._instanciaSingleton === undefined) {
            this._instanciaSingleton = new EscenaControlador();
        }

        return this._instanciaSingleton;
    }

    public static get numeroEscenas(): number {
        return this._numeroEscenas;
    }

    public static getEscena(): Escena {
        return this._escenaActual;
    }

    public static updateCamara(ancho: number, alto: number): void {
        this._escenaActual?.updateCamara(ancho, alto);
    }    

    public static getMatricesCamara(): ViewProj {
        return this._escenaActual?.getMatricesCamara();
    }

    public static inicializarEscenas(directorios: string[]): void {
        directorios.forEach((escenaJson) => {
            EscenaControlador.anadirEscena(escenaJson);
        });

        Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO, this.instancia);
    }

    private static anadirEscena(escena: string) {
        this._escenas[escena.split('.')[0]] = `Escenas/${escena}`;
        ++this._numeroEscenas;
    }

    /**
     * Cambia entre las escenas.
     * @param id Id de la escena al que se quiere cambiar.
     */
    public static cambiarEscena(id: string, f: () => void): void {
        this._alCargar = f;
        this._escenaCargada = false;
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

        EscenaControlador._escenaActual = new Escena(idEscena, nombreEscena);
        EscenaControlador._escenaActual.inicializar(datos);
        EscenaControlador._escenaActual.cargarConfiguracion();
        
        this._alCargar();
    }
}
