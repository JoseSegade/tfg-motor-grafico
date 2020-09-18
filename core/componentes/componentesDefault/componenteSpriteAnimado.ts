import ComponenteBase from '../componenteBase';
import SpriteAnimado from '../../graficos/spriteAnimado';
import Shader from '../../gl/shader';

/**
 * Asocia un sprite animado al componente.
 * */
export default class ComponenteSpriteAnimado extends ComponenteBase {

    /**
     * True para empezar la animacion en movimiento una vez empiece a ser renderizada.
     */
    public reproducirAutomaticamente: boolean;

    /**
     * Objeto que pinta el sprite por pantalla.
     */
    public sprite: SpriteAnimado;

    /**
     * Tiempo minimo que tiene que transcurrir para camfiar de frame en la animacion.
     */
    public tiempoEntreFrames: number;

    /**
     * Nombre del material que se empleara.
     */
    public nombreMaterial: string;

    /**
     * Ancho total de la imagen que se utiliza como spritesheet.
     */
    public ancho: number;

    /**
     * Alto total de la imagen que se utiliza como spritesheet.
     */
    public alto: number;

    /**
     * Ancho de cada frame.
     */
    public anchoFrame: number;

    /**
     * Alto de cada frame.
     */
    public altoFrame: number;

    /**
     * Numbero total de frames que tiene la animacion.
     */
    public numeroDeFrames: number;

    /**
     * Orden de pintado de la secuencia.
     */
    public secuenciaFrames: number[];

    /**
     * Indice del frame desde el que empieza el dibujado.
     */
    public offset: number;

    /**
     * True si el sprite esta reproduciendose actualmente.
     * */
    public get enMovimiento(): boolean {
        return this.sprite.enMovimiento;
    }

    /**
     * Carga en memoria los datos de configuracion necesarios para el funcionamiento del sprite.
     * */
    public cargarConfiguracion(): void {
        this.sprite = new SpriteAnimado({
            nombre: this.nombre,
            nombreMaterial: this.nombreMaterial,
            ancho: this.ancho,
            alto: this.alto,
            anchoFrame: this.anchoFrame,
            altoFrame: this.altoFrame,
            numeroDeFrames: this.numeroDeFrames,
            secuenciaFrames: this.secuenciaFrames,
            tiempoEntreFrames: this.tiempoEntreFrames,
            offset: this.offset
        });
        this.sprite.cargarConfiguracion();
        
    }
    
    /**
     * Ejecuta la primera vez que ya se ha cargado la configuracion.
     * */
    public activar(): void {
        if (!this.reproducirAutomaticamente) {
            this.sprite.parar();
        }
    }

    public update(time: number): void {
        this.sprite.update(time);
        super.update(time);
    }

    /**
     * Rendea el componente.
     * @param shader Shader de dibujado.
     */
    public render(shader: Shader): void {
        this.sprite.dibujar(shader, this.objetoVirtual.worldMatrix);
        super.render(shader);
    }

    /**
     * Reproduce el sprite.
     * */
    public reproducir(): void {
        this.sprite.reproducir();
    }

    /**
     * Para el sprite.
     * */
    public parar(): void {
        this.sprite.parar();
    }

    /**
     * Cambia el frame actual en el que se encuentra el sprite.
     * @param numeroDeFrame Frame concreto al que se quiere ir.
     */
    public irAlFrame(numberoDeFrame: number): void {
        this.sprite.irAlFrame(numberoDeFrame);
    }
}
