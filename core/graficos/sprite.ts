import Vector3 from "../math/vector3";
import BufferWebGl from "../gl/bufferWebGl";
import Material from "./material";
import Vertice from "./vertice";
import Materiales from "./materiales";
import { gl } from "../gl/gl";
import Matrix4x4 from "../math/matrix4x4";
import Shader from "../gl/shader";
import AttributeInfo from "../gl/attributeInfo";

/**
 * Almacena los datos necesarios para pintar un sprite bidimensional.
 * */
export default class Sprite {

    protected _nombre: string;
    protected _ancho: number;
    protected _alto: number;
    protected _origen: Vector3 = Vector3.zero;

    protected _buffer: BufferWebGl;
    protected _nombreMaterial: string;
    protected _material: Material;
    protected _vertices: Vertice[] = [];

    /**
     * Crea un nuevo sprite.
     * @param nombre Nombre del sprite.
     * @param nombreMaterial Nombre del material (que tendra la imagen cargada) del sprite.
     * @param ancho Ancho del sprite.
     * @param alto Alto del sprite.
     */
    public constructor(nombre: string, nombreMaterial: string, ancho: number = 100, alto: number = 100) {
        this._nombre = nombre;
        this._ancho = ancho;
        this._alto = alto;
        this._nombreMaterial = nombreMaterial;
        this._material = Materiales.obtenerMaterial(this._nombreMaterial);
    }

    /**
     * Nombre del sprite
     * */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Origen respecto a la esquina superior izquierda (0, 0)
     * */
    public get origen(): Vector3 {
        return this._origen;
    }

    /**
     * Origen respecto a la esquina superior izquierda (0, 0)
     * */
    public set origen(value: Vector3) {
        this._origen = value;
        this.recalcularValorVertices();
    }

    /**
     * Ancho del sprite.
     * */
    public get ancho(): number {
        return this._ancho;
    }

    /**
     * Alto del sprite.
     * */
    public get alto(): number {
        return this._alto;
    }

    /**
     * Destruye el sprite y libera la memoria.
     * */
    public destroy(): void {
        if (this._buffer) {
            this._buffer.destroy();
        }

        if (this._material) {
            Materiales.destruirMaterial(this._nombreMaterial);
            this._material = undefined;
            this._nombreMaterial = undefined;
        }
    }

    /**
     * Carga la configuracion necesaria para el sprite.
     * */
    public cargarConfiguracion(): void {

        const atributoPosicion: AttributeInfo = new AttributeInfo();
        atributoPosicion.cargar(0, 3);

        const atributoCordenadaTextura: AttributeInfo = new AttributeInfo();
        atributoCordenadaTextura.cargar(1, 2);

        this._buffer = new BufferWebGl();
        this._buffer.anadirIdAtributo(atributoPosicion);
        this._buffer.anadirIdAtributo(atributoCordenadaTextura);
        this.calcularValorVertices();
    }

    /**
     * Actualiza el sprite.
     * @param milisegundos Tiempo desde la ultima actualizacion.
     */
    public update(milisegundos: number) {

    }

    /**
     * Dibuja el sprite.
     * @param shader Shader de pintado.
     * @param model Matrix model.
     */
    public dibujar(shader: Shader, model: Matrix4x4): void {

        const modelId: WebGLUniformLocation = shader.obtenerIdentificacion('u_model', true);
        gl.uniformMatrix4fv(modelId, false, model.toFloat32Array());

        const colorId: WebGLUniformLocation = shader.obtenerIdentificacion('u_tint', true);
        gl.uniform4fv(colorId, this._material.color.toFloat32Array());

        if (this._material.texturaDifusa !== undefined) {
            this._material.texturaDifusa.activarYAsociarTextura(0);
            const difId: WebGLUniformLocation = shader.obtenerIdentificacion('u_diffuse', true);
            gl.uniform1i(difId, 0);
        }

        this._buffer.bind();
        this._buffer.dibujar();
    }

    protected calcularValorVertices(): void {
        const { minX, maxX, minY, maxY } = this.calcularCoordenadas();

        this._vertices = [
            new Vertice(minX, minY, 0.0, 0.0, 0.0),
            new Vertice(minX, maxY, 0.0, 0.0, 1.0),
            new Vertice(maxX, maxY, 0.0, 1.0, 1.0),
            new Vertice(maxX, maxY, 0.0, 1.0, 1.0),
            new Vertice(maxX, minY, 0.0, 1.0, 0.0),
            new Vertice(minX, minY, 0.0, 0.0, 0.0)
        ];

        this.actualizarVertices();
    }

    protected recalcularValorVertices(): void {
        const { minX, maxX, minY, maxY } = this.calcularCoordenadas();

        this._vertices[0].posicion.set(minX, minY);
        this._vertices[1].posicion.set(minX, maxY);
        this._vertices[2].posicion.set(maxX, maxY);
        this._vertices[3].posicion.set(maxX, maxY);
        this._vertices[4].posicion.set(maxX, minY);
        this._vertices[5].posicion.set(minX, minY);

        this.actualizarVertices();
    }

    protected actualizarVertices(): void {
        this._buffer.limpiarBuffer();
        this._vertices.forEach(v => this._buffer.agregarDatos(v.toArray()));
        this._buffer.cargarBufferEnWebGl();
        this._buffer.unbind();
    }

    private calcularCoordenadas() {
        return {
            minX: -(this._ancho * this._origen.x),
            maxX: this._ancho * (1.0 - this._origen.x),
            minY: -(this._alto * this._origen.y),
            maxY: this._alto * (1.0 - this._origen.y)
        }
    }
}
