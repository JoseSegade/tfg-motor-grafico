import ComponenteBase from '../componenteBase';
import Sprite from '../../../graficos/sprite';
import Shader from '../../../sistema/gl/shader';
import Renderizable from '../renderizable';
import ViewProj from 'motor/logica/escena/viewProj';

/**
 * Esta clase asocia un sprite a un componente para que el objeto se pueda pintar en pantalla
 * */
export default class ComponenteSprite extends ComponenteBase implements Renderizable {
    /**
     * Objeto srpite que se pintara por pantalla.
     */
    public sprite: Sprite;

    /**
     * Ancho del sprite.
     */
    public ancho: number;

    /**
     * Alto del sprite.
     */
    public alto: number;

    /**
     * Nombre del material empleado.
     */
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
    public render(shader: Shader, matrices: ViewProj): void {
        this.sprite.dibujar(shader, this.objetoVirtual.worldMatrix, matrices);
    }
}
