export enum Rutas {
    JUEGO = '',
    COMPONENTES = 'componentes',
    FUENTES = 'fuentes',
    FUNCIONALIDADES = 'funcionalidades',
    SONIDOS = 'sonidos',
    TEXTURAS = 'texturas',
    NIVELES = 'niveles'
}

export default class ConstruirRuta {
    private static rutaJuego = '/';

    public static cambiarRutaJuego(ruta: string): void {
        ConstruirRuta.rutaJuego = ruta;
    }

    public static construirRuta(rutaRaiz: Rutas, ...rutasSecundaria: string[] | Rutas[]): string {
        let rutaReturn: string;
        if (rutaRaiz === Rutas.JUEGO) {
            rutaReturn = ConstruirRuta.rutaJuego;
        }
        else {
            rutaReturn = ConstruirRuta.rutaJuego + 'assets/' + rutaRaiz.toString();
        }

        rutasSecundaria.forEach(ruta => rutaReturn += ('/' + ruta));

        return rutaReturn;
        
    }
}