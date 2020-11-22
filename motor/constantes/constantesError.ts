/**
 * Almacena las constantes de error.
 * */
export default class ConstantesError {
  public static ERROR_ESCENA_VACIA =
    'Error al inicializar la escena. La escena no contiene objetos.';
  public static ERROR_GAME_AREA =
    'Error. Debe inicializarse un objeto en la página con id "gameArea" que contenga el canvas WebGL.';
  public static ERROR_COMPONENTE_NO_REGISTRADO =
    'Error en el creador de componentes. El componente no esta registrado.';
  public static ERROR_INICIALIZAR_WEB_GL = 'Error al inicializar WebGl.';
  public static ERROR_BUSCAR_CANVAS = 'El canvas que se pretende buscar no existe.';
  public static ERROR_LINKADO_SHADERS = 'Error en el linkado de shaders.';
  public static ERROR_COMPILACION_SHADERS = 'Error en la compilacion de shaders.';
  public static ERROR_OBTENER_ATTRIBUTE = 'Error al obtener la variable attribute.';
  public static ERROR_OBTENER_UNIFORM = 'Error al obtener la variable uniform.';
  public static ERROR_TIPO_DATO = 'El shader no puede reconocer el tipo de dato.';
  public static ERROR_TIPO_DATO_CARGA_MEMORIA =
    'El shader no puede reconocer el tipo de dato que esta intentando ser cargado en memoria.';
  public static ERROR_ID_ESCENA = 'El id de la escena no se ha encontrado.';
  public static ERROR_NOMBRE_ESCENA = 'El nombre la escena no se ha encontrado.';
  public static ERROR_ID_ESCENA_INEXISTENTE =
    'El id proporcionado no corresponde con ninguna escena.';
  public static ERROR_FRAME =
    'El frame al que esta intentando accederse esta fuera de los limites del array.';
  public static ERROR_CARACTERES =
    'El numero de caracteres del archivo no coincide con el numero de caracteres encontrados';
  public static ERROR_OBTENER_FUENTES = 'Error, la fuente no existe.';
  public static ERROR_OBTENER_COMPONENTE =
    'Error al intentar obtener el componente, no se ha especificado su tipo.';
  public static ERROR_OBTENER_SHADER =
    'Error al obtener el shader. Asegurate de que existe un shader de vertices (.vert) y otro de fragmentos (.frag) en la carpteta public con el mismo nombre que los shader actuales.';
  public static ERROR_CREAR_SHADER =
    'Error. El objeto shader no encuentra la ruta del archivo de vertices o fragmentos.';
  public static ERROR_NO_SHADERS =
    'Error. Se debe proporcionar al menos un shader (con vertices y fragmentos) para usarse.';
  public static ERROR_ID_CAMARA = 'Error. Todas las camaras deben tener un id para identificarse.';
  public static WARNING_CAMARA_NO_RENDERIZABLE =
    'ATENCION: Los componentes de la camara no pueden ser renderizables.';
}
