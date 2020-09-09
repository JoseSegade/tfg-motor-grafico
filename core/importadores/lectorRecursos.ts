import fs from 'fs';
import path from 'path';

export interface RecursosLeidos {
    componentes: string[];
    funcionalidades: string[];
    niveles: string[];
}

const inicializarComponentes = async (): Promise<string[]> => {
    const componentes = await fs.promises.readdir(
        path.join(process.cwd(), 'core/componentes/componentesDefault'),
    );
    componentes.filter((file) => file.endsWith('.ts'));
    return componentes;

    
};

/**
 * Crea las funcionalidades disponibles.
 */
const inicializarFuncionalidades = async (): Promise<string[]> => {
    const funcionalidades: string[] = await fs.promises.readdir(
        path.join(process.cwd(), 'core/funcionalidades/funcionalidadesDefault'),
    );
    funcionalidades.filter((file) => file.endsWith('.ts'));
    return funcionalidades;
};

const inicializarNiveles = async (): Promise<string[]> => {
    const directorios: string[] = await fs.promises.readdir(
        path.join(process.cwd(), 'assets/niveles/'),
    );
    directorios.filter((nivelJson) => nivelJson.endsWith('.json'));
    return directorios;    
};

const lectorRecursos = async (): Promise<RecursosLeidos> => {
    const componentes: string[] = await inicializarComponentes();
    const funcionalidades: string[] = await inicializarFuncionalidades();
    const niveles: string[] = await inicializarNiveles();
    return { componentes, funcionalidades, niveles };
};

export default lectorRecursos;
