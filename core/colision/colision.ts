import ComponenteColision from '../componentes/componentesDefault/ComponenteColision';

/**
 * Almacena los datos de una colision.
 * */
export default class Colision {
    readonly a: ComponenteColision;
    readonly b: ComponenteColision;

    public constructor(a: ComponenteColision, b: ComponenteColision) {
        this.a = a;
        this.b = b;
    }
}
