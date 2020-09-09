import FuncionalidadBase from 'core/funcionalidades/funcionalidadBase';
import Nivel from 'core/mundo/nivel';

export default class FuncionalidadGeneradorPiezas
    extends FuncionalidadBase{


      public jsonPrefabs: Array<any>;

    public cargarConfiguracion() {
      this.jsonPrefabs.forEach((obj) => /*Nivel.cargarObjetoVirtual(obj, this.objetoVirtual)*/obj);
      super.cargarConfiguracion();
    }
}
