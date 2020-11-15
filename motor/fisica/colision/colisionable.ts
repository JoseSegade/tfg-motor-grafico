import ObjetoVirtual from '../../logica/escena/objetoVirtual';

/**
 * Define una interfaz para los componentes que tengan un componente colision.
 * */
export default interface Colisionable {
    alEntrarColision(other: ObjetoVirtual): void;
    alMantenerColision(other: ObjetoVirtual): void;
    alSalirColision(other: ObjetoVirtual): void;
}
