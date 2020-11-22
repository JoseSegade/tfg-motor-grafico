import fs from 'fs';
import ConstantesError from 'motor/constantes/constantesError';
import path from 'path';

export interface RecursosLeidos {
  componentes: string[][];
  escenas: string[];
  texturas: string[];
  shaders: { [nombre: string]: [string, string]};
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

const inicializarTexturas = async (): Promise<string[]> => {
  const directorios: string[] = await fs.promises.readdir(
    path.join(process.cwd(), 'public/textures/'),
  );
  directorios.filter((escenaJson) => escenaJson.endsWith('.png'));
  return directorios;
};

const inicializarShaders = async (): Promise<{}> => {
  const shaders = {};
  const shaderList = await fs.promises.readdir(
    path.join(process.cwd(), 'motor/sistema/gl/shaders'),
  )

  shaderList.forEach((shader): void => {
    const nombreShader = shader.split('.')[0];
    shaders[shader] = [];
    const extPth = `public/shaders/${nombreShader}`;
    if (fs.existsSync(`${extPth}.vert`) && fs.existsSync(`${extPth}.frag`)) {
      shaders[shader].push(`${nombreShader}.vert`);
      shaders[shader].push(`${nombreShader}.frag`);
    } else {
      throw new Error(ConstantesError.ERROR_OBTENER_SHADER);
    }

  })
  return shaders;
};

const lectorRecursos = async (): Promise<RecursosLeidos> => {
  const componentes: string[][] = await inicializarComponentes();
  const escenas: string[] = await inicializarEscenas();
  const texturas: string[] = await inicializarTexturas();
  const shaders: {} = await inicializarShaders();
  return { componentes, escenas, texturas, shaders };
};

export default lectorRecursos;
