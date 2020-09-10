import ObjetoVirtual from './ObjetoVirtual';
import Shader from '../gl/shader';

/**
 * Mundo virtual donde se cargaran los objetos.
 * */
export default class MundoVirtual {
    private _objetoMundo: ObjetoVirtual;
    private static readonly IDENTIFICADOR_RAIZ: string = '__ROOT__';

    public constructor() {
        this._objetoMundo = new ObjetoVirtual(0, MundoVirtual.IDENTIFICADOR_RAIZ, this);
    }

    /**
     * Devuelve el objeto mundo que contiene todos los demas objetos.
     * */
    public get objetoMundo(): ObjetoVirtual {
        return this._objetoMundo;
    }

    /**
     * Devuelve true si el mundo virtual esta configurado.
     * */
    public get estaConfigurado(): boolean {
        return this._objetoMundo.estaConfigurado;
    }

    /**
     * Anade un objeto virtual nuevo al mundo virtual.
     * @param objetoVirtual Objeto que sera anadido.
     */
    public anadirObjetoVirtual(objetoVirtual: ObjetoVirtual): void {
        this._objetoMundo.anadirObjetoHijo(objetoVirtual);
    }

    /**
     * Devuelve el objeto virtual cuyo nombre coincida con el que se pasa por parametro.
     * @param nombre Nombre del objeto virtual.
     */
    public obtenerObjeto(nombre: string): ObjetoVirtual {
        return this._objetoMundo.obtenerObjeto(nombre);
    }

    /**
     * Carga en memoria la configuracion del mundo virtual.
     * */
    public cargarConfiguracion(): void {
        this._objetoMundo.cargarConfiguracion();
    }

    /**
     * Actualiza el mundo virtual.
     * @param milisegundos Tiempo desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
        this._objetoMundo.update(milisegundos);
    }

    /**
     * Renderiza el mundo virtual.
     * @param shader Shader con el que se renderiza.
     */
    public render(shader: Shader): void {
        this._objetoMundo.render(shader);
    }

    public debug_imprimirEscenaPorPantalla() {
        console.log(this.objetoMundo);
    }
}
