
/**
 * Almacena las constantes de error.
 * */
export default class ConstantesError {
    public static ERROR_ESCENA_VACIA: string = 'Error al inicializar la escena. La escena no contiene objetos.';
    public static ERROR_COMPONENTE_NO_REGISTRADO: string = 'Error en el creador de componentes. El componente no esta registrado.';
    public static ERROR_INICIALIZAR_WEB_GL: string = 'Error al inicializar WebGl.';
    public static ERROR_BUSCAR_CANVAS: string = 'El canvas que se pretende buscar no existe.';
    public static ERROR_LINKADO_SHADERS: string = 'Error en el linkado de shaders.';
    public static ERROR_COMPILACION_SHADERS: string = 'Error en la compilacion de shaders.';
    public static ERROR_OBTENER_ATTRIBUTE: string = 'Error al obtener la variable attribute.';
    public static ERROR_OBTENER_UNIFORM: string = 'Error al obtener la variable uniform.';
    public static ERROR_TIPO_DATO: string = 'El shader no puede reconocer el tipo de dato.';
    public static ERROR_TIPO_DATO_CARGA_MEMORIA: string = 'El shader no puede reconocer el tipo de dato que esta intentando ser cargado en memoria.';
    public static ERROR_ID_ESCENA: string = 'El id de la escena no se ha encontrado.';
    public static ERROR_NOMBRE_ESCENA: string = 'El nombre la escena no se ha encontrado.';
    public static ERROR_ID_ESCENA_INEXISTENTE: string = 'El id proporcionado no corresponde con ninguna escena.';
    public static ERROR_FRAME: string = 'El frame al que esta intentando accederse esta fuera de los limites del array.';
    public static ERROR_CARACTERES: string = 'El numero de caracteres del archivo no coincide con el numero de caracteres encontrados';
    public static ERROR_OBTENER_FUENTES: string = 'Error, la fuente no existe.';
    public static ERROR_OBTENER_COMPONENTE: string = 'Error al intentar obtener el componente, no se ha especificado su tipo.';
}