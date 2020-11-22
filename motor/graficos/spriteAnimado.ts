import Sprite from './sprite';
import SuscripcionMensaje from '../logica/mensajes/suscripcionMensaje';
import Mensaje from '../logica/mensajes/mensaje';
import ConstantesMensajeria from '../constantes/constantesMensajeria';
import RecursoImagen from '../logica/importadores/recursos/recursoImagen';
import UVInfo from './UVInfo';
import ConstantesError from '../constantes/constantesError';
import Shader from '../sistema/gl/shader';
import Matrix4x4 from '../fisica/matematicas/matrix4x4';
import Materiales from './materiales';
import Importadores from '../logica/importadores/importadores';
import Vector2 from '../fisica/matematicas/vector2';

/**
 * Util para pasar los datos que cumplan con esta interfaz.
 * */
export class SpriteAnimadoInfo {
    /**
     * Nombre del sprite
     * */
    public nombre: string;

    /**
     * Nombre del material que carga el spritesheet.
     * */
    public nombreMaterial: string;

    /**
     * Ancho del sprite en el canvas.
     * */
    public ancho: number = 100;

    /**
     * Alto del sprite en el canvas.
     * */
    public alto: number = 100;

    /**
     * Ancho de cada frame en px.
     * */
    public anchoFrame: number = 100;

    /**
     * Alto de cada frame en px.
     * */
    public altoFrame: number = 100;

    /**
     * Numero de frames que tiene la animacion. 1 por defecto.
     * */
    public numeroDeFrames: number = 1;

    /**
     * Orden de la secuencia que se quiere reproducir
     * */
    public secuenciaFrames: number[] = [];

    /**
     * Tiempo que debe pasar en milisegundos para que el frame cambie en la animacion.
     * */
    public tiempoEntreFrames: number = 1;

    /**
     * Offset con respecto al primer frame de la animacion.
     * */
    public offset: number = 0;
}

/**
 * Sprite con animacion.
 * */
export default class SpriteAnimado extends Sprite implements SuscripcionMensaje {
    private _anchoFrame: number;
    private _altoFrame: number;
    private _numeroDeFrames: number;
    private _secuenciaFrames: number[];
    private _tiempoEntreFrames: number = 33;

    private _frameActual: number = 0;
    private _tiempoActual: number = 0;

    private _UVFrames: UVInfo[] = [];
    private _anchoImagen: number = -1;
    private _imagenCargada: boolean = false;
    private _altoImagen: number = -1;

    private _enMovimiento = true;
    private _offset: number = 0;

    /**
     * Crea un nuevo sprtie
     * @param info Informacion necesaria para crear el sprite.
     */
    public constructor(info: SpriteAnimadoInfo) {
        super(info.nombre, info.nombreMaterial, info.ancho, info.alto);
        this._anchoFrame = info.anchoFrame;
        this._altoFrame = info.altoFrame;
        this._numeroDeFrames = info.numeroDeFrames;
        this._secuenciaFrames = info.secuenciaFrames;
        this._tiempoEntreFrames = info.tiempoEntreFrames;
        this._offset = info.offset;

        Mensaje.suscribirse(
            ConstantesMensajeria.RECURSO_CARGADO + this._material.nombreTexturaDifusa,
            this,
        );
    }

    /**
     * Devuelve true si se esta ejecutando la animacion del sprite.
     * */
    public get enMovimiento(): boolean {
        return this._enMovimiento;
    }

    /*
     * Reproduce la animacion del sprite.
     * */
    public reproducir(): void {
        this._enMovimiento = true;
    }

    /**
     * Para la animacion del sprite.
     * */
    public parar(): void {
        this._enMovimiento = false;
    }

    /**
     * La animacion salta directamente al sprite seleccionado.
     * @param num
     */
    public irAlFrame(num: number): void {
        if (num >= this._numeroDeFrames) {
            throw new Error(ConstantesError.ERROR_FRAME);
        }

        this._frameActual = num;
    }

    /**
     * Destruye el sprite animado
     * */
    public destroy(): void {
        super.destroy();
    }

    /**
     * Dibuja el sprite
     * @param shader Shader para pintar.
     * @param model Matriz model.
     */
    public dibujar(shader: Shader, model: Matrix4x4): void {
        if (this._UVFrames.length < 1) {
            return;
        }
        super.dibujar(shader, model);
    }

    /**
     * Se ejecuta cuando se envia un mensaje.
     * @param message The message to be handled.
     */
    public recibirMensaje(mensaje: Mensaje): void {
        if (
            mensaje.codigo ===
            ConstantesMensajeria.RECURSO_CARGADO + this._material.nombreTexturaDifusa
        ) {
            this._imagenCargada = true;
            const imagen = mensaje.contexto as RecursoImagen;
            this._anchoImagen = imagen.ancho;
            this._altoImagen = imagen.alto;
            this.calcularUVs();
        }
    }

    /**
     * Carga la configuracion del sprite.
     * */
    public cargarConfiguracion(): void {
        super.cargarConfiguracion();
        if (!this._imagenCargada) {
            this.cargarImagen();
        }
    }

    /**
     * Carga los vertices por primera vez.
     */
    public cargarVerticesIniciales() {
        const frameUV: UVInfo = this._UVFrames[this._secuenciaFrames[this._frameActual]];
        this._vertices[0].coordenadasTextura.copyFrom(frameUV.min);
        this._vertices[1].coordenadasTextura = new Vector2(frameUV.min.x, frameUV.max.y);
        this._vertices[2].coordenadasTextura.copyFrom(frameUV.max);
        this._vertices[3].coordenadasTextura.copyFrom(frameUV.max);
        this._vertices[4].coordenadasTextura = new Vector2(frameUV.max.x, frameUV.min.y);
        this._vertices[5].coordenadasTextura.copyFrom(frameUV.min);

        this.actualizarVertices();
    }

    /**
     * Actualiza la animacion del sprite.
     * @param milisegundos Tiempo desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
        if (!this._imagenCargada) {
            this.cargarImagen();
            return;
        }

        if (!this._enMovimiento) {
            return;
        }

        this._tiempoActual += milisegundos;
        if (this._tiempoActual > this._tiempoEntreFrames) {
            this._tiempoActual = 0;
            if (this._frameActual >= this._secuenciaFrames.length) {
                this._frameActual = 0;
            }
            const frameUV: UVInfo = this._UVFrames[this._secuenciaFrames[this._frameActual]];
            this._vertices[0].coordenadasTextura.copyFrom(frameUV.min);
            this._vertices[1].coordenadasTextura = new Vector2(frameUV.min.x, frameUV.max.y);
            this._vertices[2].coordenadasTextura.copyFrom(frameUV.max);
            this._vertices[3].coordenadasTextura.copyFrom(frameUV.max);
            this._vertices[4].coordenadasTextura = new Vector2(frameUV.max.x, frameUV.min.y);
            this._vertices[5].coordenadasTextura.copyFrom(frameUV.min);

            this.actualizarVertices();
        }

        super.update(milisegundos);
    }

    private calcularUVs(): void {
        for (let idx = this._offset; idx < (this._offset + this._numeroDeFrames); idx++) {
            const i = Math.floor(idx % (this._anchoImagen / this._anchoFrame));
            const j = Math.floor(idx  / (this._anchoImagen / this._anchoFrame));

            const min: Vector2 = new Vector2(
                (i * this._anchoFrame) / this._anchoImagen,
                (j * this._altoFrame) / this._altoImagen,
            );
            const max: Vector2 = new Vector2(
                (i * this._anchoFrame + this._anchoFrame) / this._anchoImagen,
                (j * this._altoFrame + this._altoFrame) / this._altoImagen,
            );

            this._UVFrames.push(new UVInfo(min, max));
        }
        this.cargarVerticesIniciales();
    }

    private cargarImagen(): void {
        if (!this._imagenCargada) {
            const material = Materiales.obtenerMaterial(this._nombreMaterial);
            if (material.texturaDifusa.estaCargado) {
                if (Importadores.estaRecursoCargadoEnMemoria(material.nombreTexturaDifusa)) {
                    this._anchoImagen = material.texturaDifusa.ancho;
                    this._altoImagen = material.texturaDifusa.alto;
                    this.calcularUVs();
                    this._imagenCargada = true;
                }
            }
        }
    }
}
