import ComponenteColision from '../componentes/componentesDefault/ComponenteColision';
import Colision from './colision';

/**
 * Gestiona las colisiones del juego.
 * */
export default class Colisiones {
    private static _componentes: ComponenteColision[] = [];

    private static _colisiones: Colision[] = [];

    private constructor() {}

    /**
     * Agrega un nuevo agente de colision a tener en cuenta.
     * @param componente Componente que se quiere anadir.
     */
    public static agregarComponente(componente: ComponenteColision): void {
        Colisiones._componentes.push(componente);
    }

    /**
     * Saca el componente de la lista de objetos a tener en cuenta entre los colisionables.
     * @param componente Componente a sacar.
     */
    public static sacarComponente(componente: ComponenteColision): void {
        const idx = Colisiones._componentes.indexOf(componente);
        if (idx !== -1) {
            Colisiones._componentes.slice(idx, 1);
        }
    }

    /**
     * Limipia todos los componentes que se tienen en cuenta con las colisiones.
     * */
    public static clear(): void {
        Colisiones._componentes.splice(0, Colisiones._componentes.length);
    }

    /**
     * Actualiza las colisiones.
     * @param milisegundos Tiempo transcurrido desde la ultima actualizacion.
     */
    public static update(_milisegundos: number): void {
        let colisionesActuales: Colision[] = [];
        Colisiones._componentes.forEach((comp) => {
            Colisiones._componentes.forEach((otro) => {
                if (!(comp.esEstatico && otro.esEstatico)) {
                    if (comp !== otro && comp.forma.intersecciona(otro.forma)) {
                        const elementos: Colision[] = Colisiones._colisiones.filter(
                            (colision) =>
                                (colision.a === comp && colision.b === otro) ||
                                (colision.a === otro && colision.b === comp),
                        );

                        if (
                            !colisionesActuales.some(
                                (colision) =>
                                    (colision.a === comp && colision.b === otro) ||
                                    (colision.a === otro && colision.b === comp),
                            )
                        ) {
                            if (!elementos.length) {
                                const nuevaCol: Colision = new Colision(comp, otro);
                                colisionesActuales.push(nuevaCol);
                                comp.alEntrarColision(otro);
                                otro.alEntrarColision(comp);
                                //Mensaje.enviarPrioritariamente('COLLISION_ENTRY', undefined, colData);
                            } else {
                                colisionesActuales = colisionesActuales.concat(elementos);
                                comp.alMantenerColision(otro);
                                otro.alMantenerColision(comp);
                            }
                        }
                    }
                }
            });
        });

        Colisiones._colisiones
            .filter((valor) => !colisionesActuales.some((colisionado) => colisionado === valor))
            .forEach((v) => {
                v.a.alSalirColision(v.b);
                v.b.alSalirColision(v.a);
                //Mensaje.enviarPrioritariamente('COLLISION_EXIT', undefined, v);
            });

        Colisiones._colisiones.splice(0, Colisiones._colisiones.length);
        Colisiones._colisiones = [...colisionesActuales];
    }
}
