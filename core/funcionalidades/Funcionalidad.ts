import ObjetoVirtual from '../mundo/ObjetoVirtual';

/**
 * Proporciona la estructura basica que debe seguir una funcionalidad.
 * */
export default interface Funcionalidad {
    /**
     * Nombre de la funcionalidad.
     * */
    nombre: string;

    /**
     * Objeto al que pertenece esta funcionalidad.
     * */
    readonly objetoVirtual: ObjetoVirtual;

    /**
     * Cambia el objeto al que pertenece esta funcionalidad.
     * @param objetoVirtual Objeto al que se quiere hacer perteneciente a la funcionalidad.
     */
    cambiarObjetoVirtual(objetoVirtual: ObjetoVirtual): void;

    /**
     * Activa el objeto. Carga la configuracion antes del primer update.
     * */
    activar(): void;

    /**
     * Carga la configuracion necesaria para que el objeto pueda funcionar.
     * */
    cargarConfiguracion(): void;

    /**
     * Actualiza los datos de esta funcionalidad.
     * @param milisegundos Tiempo que ha pasado desde la ultima actualizacion.
     */
    update(time: number): void;
}
