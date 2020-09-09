import ComponenteBase from '../componenteBase';
import Sprite from '../../graficos/sprite';
import Shader from '../../gl/shader';

/**
 * Esta clase asocia un sprite a un componente para que el objeto se pueda pintar en pantalla
 * */
export default class ComponenteSprite extends ComponenteBase {
    public sprite: Sprite;
    public ancho: number;
    public alto: number;
    public nombreMaterial: string;

    /**
     * Carga la configuracion necesaria.
     * */
    public cargarConfiguracion(): void {
        this.sprite = new Sprite(this.nombre, this.nombreMaterial, this.ancho, this.alto);
        this.sprite.cargarConfiguracion();
    }

    /**
     * Rendea el sprite en pantalla.
     * @param shader Shader de dibujado.
     */
    public render(shader: Shader): void {
        this.sprite.dibujar(shader, this.objetoVirtual.worldMatrix);
        super.render(shader);
    }
}
