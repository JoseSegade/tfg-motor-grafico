import Funcionalidad from "./Funcionalidad";
import ObjetoVirtual from "../mundo/ObjetoVirtual";

/**
 * Clase principal de la que deben heredar todas las funcionalidades que se programen.
 * */
export default abstract class FuncionalidadBase implements Funcionalidad {

    /** 
     *  Objeto virtual al que se le ha asociado la funcionalidad
     *  */
    public objetoVirtual: ObjetoVirtual;

    /**
     * Nombre de la funcionalidad
     * */
    public nombre: string;

    /**
     * Cambia el objeto virtual al que pertenece esta funcionalidad.
     * @param objetoVirtual Objeto virtual al que se asignara la funcionalidad.
     */
    public cambiarObjetoVirtual(objetoVirtual: ObjetoVirtual): void {
        this.objetoVirtual = objetoVirtual;
    }

    /**
     * Carga la configuracion de la funcionalidad.
     * */
    public cargarConfiguracion(): void {

    }

    /**
     * Activa la funcionalidad la primera vez que se ejecuta.
     * */
    public activar(): void {

    }

    /**
     * Actualiza los datos de la funcionalidad.
     * @param milisegundos Milisegundos desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {

    }
}
