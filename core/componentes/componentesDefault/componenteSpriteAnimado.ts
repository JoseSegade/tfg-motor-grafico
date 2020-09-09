import ComponenteBase from '../componenteBase';
import SpriteAnimado from '../../graficos/spriteAnimado';
import Shader from '../../gl/shader';

/**
 * Asocia un sprite animado al componente.
 * */
export default class ComponenteSpriteAnimado extends ComponenteBase {
    public reproducirAutomaticamente: boolean;
    public sprite: SpriteAnimado;
    public tiempoEntreFrames: number;
    public nombreMaterial: string;
    public ancho: number;
    public alto: number;
    public anchoFrame: number;
    public altoFrame: number;
    public numeroDeFrames: number;
    public secuenciaFrames: number[];
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
