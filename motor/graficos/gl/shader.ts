import { gl } from './gl';
import ConstantesError from '../../constantes/constantesError';

/**
 * Almacena los datos de un Shader.
 * */
export default abstract class Shader {
    private _nombre: string;
    private _programaWebGl: WebGLProgram;
    private _attributes: { [nombre: string]: number } = {};
    private _uniforms: { [nombre: string]: WebGLUniformLocation } = {};

    /**
     * Creates a new shader.
     * @param name The name of this shader.
     * @param vertexSource The source of the vertex shader.
     * @param fragmentSource The source of the fragment shader.
     */
    public constructor(nombre: string) {
        this._nombre = nombre;
    }

    /**
     * Nombre del shader.
     */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Utiliza este shader.
     * */
    public utilizarShader(): void {
        gl.useProgram(this._programaWebGl);
    }

    /**
     * Obtiene la localizacion de la variable attribute o uniform.
     * @param nombre Nombre de la variable.
     * @param esVariableUniform true si la variable es uniform.
     */
    public obtenerIdentificacion(
        nombre: string,
        esVariableUniform: boolean,
    ): number | WebGLUniformLocation {
        const id = esVariableUniform ? this._uniforms[nombre] : this._attributes[nombre];
        if (id === undefined) {
            throw new Error(
                (esVariableUniform
                    ? ConstantesError.ERROR_OBTENER_UNIFORM
                    : ConstantesError.ERROR_OBTENER_ATTRIBUTE) + ` ${nombre} en ${this.nombre}`,
            );
        }
        return id;
    }

    /**
     * Carga la configuracion de los shaders en memoria.
     * @param shaderVertices Ubicacion del shader de vertices.
     * @param shaderFragmentos Ubicacion del shader de fragmentos.
     */
    protected cargarConfiguracion(shaderVertices: string, shaderFragmentos: string): void {
        const vertexShader = this.cargarShader(shaderVertices, gl.VERTEX_SHADER);
        const fragmentShader = this.cargarShader(shaderFragmentos, gl.FRAGMENT_SHADER);

        this.crearPrograma(vertexShader, fragmentShader);

        this.buscarAttributes();
        this.buscarUniforms();
    }

    private cargarShader(ruta: string, tipo: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(tipo);

        gl.shaderSource(shader, ruta);
        gl.compileShader(shader);

        const error = gl.getShaderInfoLog(shader).trim();
        if (error) {
            throw new Error(
                ConstantesError.ERROR_COMPILACION_SHADERS + ` '${this.nombre}': ${error}`,
            );
        }

        return shader;
    }

    private crearPrograma(shaderVertices: WebGLShader, shaderFragmentos: WebGLShader): void {
        this._programaWebGl = gl.createProgram();

        gl.attachShader(this._programaWebGl, shaderVertices);
        gl.attachShader(this._programaWebGl, shaderFragmentos);

        gl.linkProgram(this._programaWebGl);

        const error = gl.getProgramInfoLog(this._programaWebGl).trim();
        if (error) {
            throw new Error(ConstantesError.ERROR_LINKADO_SHADERS + ` ${this.nombre}: ${error}`);
        }
    }

    private buscarAttributes(): void {
        this.buscarYGuardarEnDiccionario(false);
    }

    private buscarUniforms(): void {
        this.buscarYGuardarEnDiccionario(true);
    }

    private buscarYGuardarEnDiccionario(esVariableUniforme = false): void {
        const n = gl.getProgramParameter(
            this._programaWebGl,
            esVariableUniforme ? gl.ACTIVE_UNIFORMS : gl.ACTIVE_ATTRIBUTES,
        );
        for (let i = 0; i < n; ++i) {
            const info: WebGLActiveInfo = esVariableUniforme
                ? gl.getActiveUniform(this._programaWebGl, i)
                : gl.getActiveAttrib(this._programaWebGl, i);
            if (!info) {
                break;
            }
            if (esVariableUniforme) {
                this._uniforms[info.name] = gl.getUniformLocation(this._programaWebGl, info.name);
            } else {
                this._attributes[info.name] = gl.getAttribLocation(this._programaWebGl, info.name);
            }
        }
    }
}
