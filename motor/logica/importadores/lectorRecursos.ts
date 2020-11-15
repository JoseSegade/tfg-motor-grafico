import fs from 'fs';
import path from 'path';

export interface RecursosLeidos {
  componentes: string[][];
  escenas: string[];
}

const inicializarComponentes = async (): Promise<string[][]> => {
  const componentes: string[][] = [];
  componentes[0] = await fs.promises.readdir(
    path.join(process.cwd(), 'motor/logica/componentes/componentesDefault'),
  );
  const extPth = path.join(process.cwd(), 'assets/componentes');
  if (fs.existsSync(extPth)) {
    componentes[1] = await fs.promises.readdir(extPth);
  } else {
    componentes[1] = undefined;
  }
  return componentes;
};

const inicializarEscenas = async (): Promise<string[]> => {
  const directorios: string[] = await fs.promises.readdir(
    path.join(process.cwd(), 'public/escenas/'),
  );
  directorios.filter((escenaJson) => escenaJson.endsWith('.json'));
  return directorios;
};

const lectorRecursos = async (): Promise<RecursosLeidos> => {
  const componentes: string[][] = await inicializarComponentes();
  const escenas: string[] = await inicializarEscenas();
  return { componentes, escenas };
};

export default lectorRecursos;
