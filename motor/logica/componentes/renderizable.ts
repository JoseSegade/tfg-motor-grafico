import Shader from "../../sistema/gl/shader";
import ViewProj from "../escena/viewProj";

export default interface Renderizable{
  /**
     * Rendea por pantalla el componente.
     * @param shader Shader que se utilizara.
     * @param camara Camara desde la que se renderiza.
     */
    render(shader: Shader, camara: ViewProj): void;
}