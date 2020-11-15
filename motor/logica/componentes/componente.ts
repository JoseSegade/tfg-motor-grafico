import ObjetoVirtual from '../escena/objetoVirtual';
import Shader from '../../graficos/gl/shader';

/**
 * Define las funciones que debe tener un componente.
 * */
export default interface Componente {
    /**
     * Nombre del componente.
     * */
    nombre: string;

    /**
     * Objeto virtual al que pertenece el componente.
     * */
    readonly objetoVirtual: ObjetoVirtual;

    /**
     * Cambia el objeto virtual al que pertenece el componente.
     * @param objetoVirtual
     */
    cambiarObjetoVirtual(objetoVirtual: ObjetoVirtual): void;

    /**
     * Activa el componente.
     * */
    activar(): void;

    /**
     * Carga la configuracion oportuna del compoenente.
     * */
    cargarConfiguracion(): void;

    /**
     * Actualiza los datos del componente.
     * @param milisegundos Milisegundos desde la ultima actualizacion.
     */
    update(milisegundos: number): void;

    /**
     * Rendea el componente.
     * @param shader Shader de pintado.
     */
    render(shader: Shader): void;
}
