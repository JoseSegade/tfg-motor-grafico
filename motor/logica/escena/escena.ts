import MundoVirtual from './mundoVirtual';
import ConstantesError from '../../constantes/constantesError';
import Shader from '../../graficos/gl/shader';
import ObjetoVirtual from './objetoVirtual';
import Componentes from '../componentes/componentes';

/**
 * Posibles estados de un Escena.
 * */
export enum EstadosEscena {
    SIN_CARGAR,
    CARGANDO,
    ACTUALIZANDO,
}

/**
 * Guarda los datos de cada Escena.
 * */
export default class Escena {
    private _id: number;
    private _nombre: string;
    private _descripcion: string;
    private _mundo: MundoVirtual;
    private _estadoActual: EstadosEscena = EstadosEscena.SIN_CARGAR;
    private static _idGlobal: number = -1;

    /**
     * Crea un nuevo Escena.
     * @param id Identificador del Escena.
     * @param nombre Nombre del Escena.
     * @param descripcion Descripcion del Escena.
     */
    public constructor(id: number, nombre: string, descripcion: string) {
        this._id = id;
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._mundo = new MundoVirtual();
    }

    /**
     * Id del Escena.
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Nombre del Escena.
     */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Descripcion del Escena.
     */
    public get descripcion(): string {
        return this._descripcion;
    }

    /**
     * Mundo donde se contienen los objetos del mundo.
     */
    public get mundo(): MundoVirtual {
        return this._mundo;
    }

    /**
     * Inicializa e instancia los objetos con los datos que se le mandan.
     * @param configEscena Objeto proveniente de un json que contenga todos los datos del Escena.
     */
    public inicializar(configEscena: any) {
        if (configEscena.objetos === undefined) {
            throw new Error(ConstantesError.ERROR_ESCENA_VACIA);
        }

        const objs: Array<any> = configEscena.objetos;
        objs.forEach((obj) => Escena.cargarObjetoVirtual(obj, this._mundo.objetoMundo));
    }

    /**
     * Carga configuracion necesaria para el mundo.
     * */
    public cargarConfiguracion(): void {
        this._estadoActual = EstadosEscena.CARGANDO;
        this._mundo.cargarConfiguracion();
        this._mundo.objetoMundo.activar();
        this._estadoActual = EstadosEscena.ACTUALIZANDO;
    }

    /**
     * Actualiza el mundo.
     * @param milisegundos Tiempo transcurrido.
     */
    public update(milisegundos: number): void {
        if (this._estadoActual === EstadosEscena.ACTUALIZANDO) {
            this._mundo.update(milisegundos);
        }
    }

    /**
     * Renderiza (dibuja) la escena.
     * @param shader Shader con el que se renderiza.
     */
    public render(shader: Shader): void {
        if (this._estadoActual === EstadosEscena.ACTUALIZANDO) {
            this._mundo.render(shader);
        }
    }

    public static cargarObjetoVirtual(configuracion: any, objetoPadre: ObjetoVirtual): ObjetoVirtual {
        let nombre: string;
        if (configuracion.nombre !== undefined) {
            nombre = String(configuracion.nombre);
        }

        const objetoVirtual: ObjetoVirtual = new ObjetoVirtual(
            ++this._idGlobal,
            nombre,
            objetoPadre?.mundoVirtual,
        );

        if (configuracion.transform !== undefined) {
            objetoVirtual.transform.setFromJson(configuracion.transform);
        }

        if (configuracion.componentes !== undefined) {
            const comps: Array<any> = configuracion.componentes;
            comps.forEach((c) => objetoVirtual.agregarComponente(Componentes.generarComponente(c)));
        }

        if (configuracion.objetosHijo !== undefined) {
            const hijos: Array<any> = configuracion.objetosHijo;
            hijos.forEach((hijo) => this.cargarObjetoVirtual(hijo, objetoVirtual));
        }

        if (objetoPadre !== undefined) {
            objetoPadre.anadirObjetoHijo(objetoVirtual);
        }

        return objetoVirtual;
    }
}
