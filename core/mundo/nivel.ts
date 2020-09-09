import MundoVirtual from './mundoVirtual';
import ConstantesError from '../constantes/ConstantesError';
import Shader from '../gl/shader';
import ObjetoVirtual from './ObjetoVirtual';
import Componentes from '../componentes/componentes';
import Funcionalidades from '../funcionalidades/funcionalidades';

/**
 * Posibles estados de un nivel.
 * */
export enum EstadosNivel {
    SIN_CARGAR,
    CARGANDO,
    ACTUALIZANDO,
}

/**
 * Guarda los datos de cada nivel.
 * */
export default class Nivel {
    private _id: number;
    private _nombre: string;
    private _descripcion: string;
    private _mundo: MundoVirtual;
    private _estadoActual: EstadosNivel = EstadosNivel.SIN_CARGAR;
    private _idGlobal: number = -1;

    /**
     * Crea un nuevo nivel.
     * @param id Identificador del nivel.
     * @param nombre Nombre del nivel.
     * @param descripcion Descripcion del nivel.
     */
    public constructor(id: number, nombre: string, descripcion: string) {
        this._id = id;
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._mundo = new MundoVirtual();
    }

    /**
     * Id del nivel.
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Nombre del nivel.
     */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Descripcion del nivel.
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
     * @param configNivel Objeto proveniente de un json que contenga todos los datos del nivel.
     */
    public inicializar(configNivel: any) {
        if (configNivel.objetos === undefined) {
            throw new Error(ConstantesError.ERROR_NIVEL_VACIO);
        }

        const objs: Array<any> = configNivel.objetos;
        objs.forEach((obj) => this.cargarObjetoVirtual(obj, this._mundo.objetoMundo));
    }

    /**
     * Carga configuracion necesaria para el mundo.
     * */
    public cargarConfiguracion(): void {
        this._estadoActual = EstadosNivel.CARGANDO;
        this._mundo.cargarConfiguracion();
        this._mundo.objetoMundo.activar();
        this._estadoActual = EstadosNivel.ACTUALIZANDO;
    }

    /**
     * Actualiza el mundo.
     * @param milisegundos Tiempo transcurrido.
     */
    public update(milisegundos: number): void {
        if (this._estadoActual === EstadosNivel.ACTUALIZANDO) {
            this._mundo.update(milisegundos);
        }
    }

    /**
     * Renderiza (dibuja) la escena.
     * @param shader Shader con el que se renderiza.
     */
    public render(shader: Shader): void {
        if (this._estadoActual === EstadosNivel.ACTUALIZANDO) {
            this._mundo.render(shader);
        }
    }

    public cargarObjetoVirtual(configuracion: any, objetoPadre: ObjetoVirtual) {
        let nombre: string;
        if (configuracion.nombre !== undefined) {
            nombre = String(configuracion.nombre);
        }

        const objetoVirtual: ObjetoVirtual = new ObjetoVirtual(++this._idGlobal, nombre, objetoPadre.mundoVirtual);

        if (configuracion.transform !== undefined) {
            objetoVirtual.transform.setFromJson(configuracion.transform);
        }

        if (configuracion.componentes !== undefined) {
            const comps: Array<any> = configuracion.componentes;
            comps.forEach((c) => objetoVirtual.agregarComponente(Componentes.generarComponente(c)));
        }

        if (configuracion.funcionalidades !== undefined) {
            const funcs: Array<any> = configuracion.funcionalidades;
            funcs.forEach((c) =>
                objetoVirtual.agregarFuncionalidad(Funcionalidades.generarFuncionalidad(c)),
            );
        }

        if (configuracion.objetosHijo !== undefined) {
            const hijos: Array<any> = configuracion.objetosHijo;
            hijos.forEach((hijo) => this.cargarObjetoVirtual(hijo, objetoVirtual));
        }

        if (objetoPadre !== undefined) {
            objetoPadre.anadirObjetoHijo(objetoVirtual);
        }
    }
}
