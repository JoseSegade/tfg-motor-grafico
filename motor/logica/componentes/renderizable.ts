import Shader from "../../sistema/gl/shader";

export default interface Renderizable{
  /**
     * Rendea por pantalla el componente.
     * @param _shader Shader que se utilizara.
     */
    render(_shader: Shader): void;
}