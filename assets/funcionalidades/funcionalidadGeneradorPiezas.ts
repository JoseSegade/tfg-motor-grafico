import FuncionalidadBase from 'core/funcionalidades/funcionalidadBase';
import Nivel from 'core/mundo/nivel';
import ObjetoVirtual from 'core/mundo/ObjetoVirtual';
import Vector2 from 'core/math/vector2';
import ComponenteSpriteAnimado from 'core/componentes/componentesDefault/componenteSpriteAnimado';
import Transform from 'core/math/transform';

export default class FuncionalidadGeneradorPiezas extends FuncionalidadBase {
    public jsonPrefab: any;
    public prefabObj: ObjetoVirtual;
    public anchoTablero: number = 8;
    public altoTablero: number = 8;
    public anchoFicha: number = 1;
    public altoFicha: number = 1;
    public framesFichas: number[] = [];
    private fichas: ObjetoVirtual[] = [];
    private posicionFichas: Vector2[] = [];

    public cargarConfiguracion(): void {
        this.prefabObj = Nivel.cargarObjetoVirtual(this.jsonPrefab, undefined);
        super.cargarConfiguracion();
    }

    public activar(): void {
        this.calcularPosicionFichas();
        this.instanciarFichas();
        this.objetoVirtual.mundoVirtual.debug_imprimirEscenaPorPantalla();
    }

    private calcularPosicionFichas(): void {
        for (let j: number = 0; j < 4; ++j) {
            for (let i: number = 0; i < 8; ++i) {
                this.posicionFichas.push(
                    new Vector2(i * this.anchoFicha, (j + (j < 2 ? 0 : 4)) * this.altoFicha),
                );
            }
        }        
    }

    private instanciarFichas(): void {
        this.posicionFichas.forEach((pos, indice) => {
            const objetoInstancia: ObjetoVirtual = Nivel.cargarObjetoVirtual(
                this.jsonPrefab,
                this.objetoVirtual,
            );
            objetoInstancia.transform = new Transform();
            objetoInstancia.transform.position.copyFrom(pos.toVector3());
            (objetoInstancia.obtenerComponente(
                'fichasSprite',
            ) as ComponenteSpriteAnimado).offset = this.framesFichas[indice];
            objetoInstancia.cargarConfiguracion();
            this.fichas.push(objetoInstancia);
        });
    }
}
