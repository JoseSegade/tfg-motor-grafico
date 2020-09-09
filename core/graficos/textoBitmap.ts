import Vector3 from "../math/vector3";
import BufferWebGl from "../gl/bufferWebGl";
import { gl } from "../gl/gl";
import BitmapFont from "./fuenteBitmap";
import Material from "./material";
import Vertice from "./vertice";
import FuentesBitmap from "./fuentesBitmap";
import Color from "./color";
import AttributeInfo from "../gl/attributeInfo";
import Shader from "../gl/shader";
import Matrix4x4 from "../math/matrix4x4";

/**
 * Carga la informacion para extraer un texto con una imagen bitmap.
 * */
export default class TextoBitmap {
    private _nombreFuente: string;
    private _pendiente: boolean = false;

    protected _nombre: string;
    protected _origen: Vector3 = Vector3.zero;

    protected _buffer: BufferWebGl;
    protected _material: Material;
    protected _fuente: BitmapFont;
    protected _vertices: Vertice[] = [];
    protected _texto: string;

    /**
     * Crea un nuevo texto que se dibujara en la escena.
     * @param nombre Nombre del elemento.
     * @param nombreFuente Nombre de la fuente que se quiere utilizar.
     */
    public constructor(nombre: string, nombreFuente: string) {
        this._nombre = nombre;
        this._nombreFuente = nombreFuente;
    }

    /**
     * Nombre del elemento texto.
     * */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Texto que actualmente esta escrito.
     * */
    public get texto(): string {
        return this._texto;
    }

    /**
     * Texto que actualmente esta escrito.
     * */
    public set texto(value: string) {
        if (this._texto !== value) {
            this._texto = value;
            this._pendiente = true;
        }
    }

    /**
     * Origen respecto a la posicion del texto.
     * */
    public get origen(): Vector3 {
        return this._origen;
    }

    /**
     * Origen respecto a la posicion del texto.
     * */
    public set origen(value: Vector3) {
        this._origen = value;
        this.calcularVertices();
    }

    /**
     * Destruye el objeto y libera la memoria.
     * */
    public destroy(): void {
        this._buffer.destroy();
        this._material.destroy();
        this._material = undefined;
    }

    /**
     * Carga la configuracion necesaria para que funcione el texto con la fuente agregada.
     * */
    public cargarConfiguracion(): void {
        this._fuente = FuentesBitmap.obtenerFuente(this._nombreFuente);
        this._material = new Material(`FUENTE_BITMAP_${this._nombre}_${this._fuente.tanamo}`, this._fuente.nombreTextura, Color.blanco);

        this._buffer = new BufferWebGl();

        const atributoPosicion = new AttributeInfo();
        atributoPosicion.cargar(0, 3);
        this._buffer.anadirIdAtributo(atributoPosicion);

        const atributoTextura = new AttributeInfo();
        atributoTextura.cargar(1, 2);
        this._buffer.anadirIdAtributo(atributoTextura);
    }

    /**
     * Actualiza los datos.
     * @param milisegundos Milisegundos desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
        if (this._pendiente && this._fuente.estaCargado) {
            this.calcularVertices();
            this._pendiente = false;
        }
    }

    /**
     * Pinta en la escena el objeto.
     * @param shader Shader con el que se pintara.
     * @param model Matriz model.
     */
    public dibujar(shader: Shader, model: Matrix4x4): void {
        const idMatrizModel = shader.obtenerIdentificacion('u_model', true);
        gl.uniformMatrix4fv(idMatrizModel, false, model.toFloat32Array());

        const idColor = shader.obtenerIdentificacion('u_tint', true);
        gl.uniform4fv(idColor, this._material.color.toFloat32Array());

        if (this._material.texturaDifusa !== undefined) {
            this._material.texturaDifusa.activarYAsociarTextura(0);
            const idTexturaDifusa = shader.obtenerIdentificacion('u_diffuse', true);
            gl.uniform1i(idTexturaDifusa, 0);
        }

        this._buffer.bind();
        this._buffer.dibujar();
    }

    private calcularVertices(): void {
        this._vertices.splice(0, this._vertices.length);
        this._buffer.limpiarBuffer();

        let x = 0;
        let y = 0;

        this._texto.split('').forEach(char => {
            if (char === '\n') {
                x = 0;
                y += this._fuente.tanamo;
            }
            else {
                const g = this._fuente.obtenerCaracter(char);
                const minX = x + g.xOffset;
                const minY = y + g.yOffset;

                const maxX = minX + g.width;
                const maxY = minY + g.height;

                const minU = g.x / this._fuente.anchoImagen;
                const minV = g.y / this._fuente.altoImagen;

                const maxU = (g.x + g.width) / this._fuente.anchoImagen;
                const maxV = (g.y + g.height) / this._fuente.altoImagen;

                this._vertices.push(new Vertice(minX, minY, 0, minU, minV));
                this._vertices.push(new Vertice(minX, maxY, 0, minU, maxV));
                this._vertices.push(new Vertice(maxX, maxY, 0, maxU, maxV));
                this._vertices.push(new Vertice(maxX, maxY, 0, maxU, maxV));
                this._vertices.push(new Vertice(maxX, minY, 0, maxU, minV));
                this._vertices.push(new Vertice(minX, minY, 0, minU, minV));

                x += g.xAdvance;
            }
        })

        this._vertices.forEach(vertex => this._buffer.agregarDatos(vertex.toArray()));
        this._buffer.cargarBufferEnWebGl();
        this._buffer.unbind();
    }
}
