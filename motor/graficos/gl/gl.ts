import ConstantesError from '../../constantes/constantesError';
/**
 * Acceso al contexto de WebGl.
 * */
export var gl: WebGLRenderingContext;

/**
 * Configura el contexto de WebGl. Funcionalidades utiles de WebGL.
 * */
export default class WebGl_Util {
    /**
     * Inicializa WebGl. En caso de que no se pase id por parametro, creara un nuevo canvas.
     * @param { string } id Id del elemento html que se quiere buscar. Opcional.
     */
    public static inicializarWebGl(id?: string): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = WebGl_Util.addOrGetCanvas(id);

        gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error(ConstantesError.ERROR_INICIALIZAR_WEB_GL);
        }

        return canvas;
    }

    private static addOrGetCanvas(id?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;
        if (id !== undefined) {
            canvas = document.getElementById(id) as HTMLCanvasElement;
            if (!canvas) {
                throw new Error(ConstantesError.ERROR_INICIALIZAR_WEB_GL);
            }
        } else {
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            document.body.appendChild(canvas);
        }
        return canvas;
    }
}
