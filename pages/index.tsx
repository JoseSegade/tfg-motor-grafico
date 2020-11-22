// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import MotorGrafico from '../motor/motorGrafico';
import lectorRecursos, { RecursosLeidos } from '../motor/logica/importadores/lectorRecursos';

interface Props {
    recursos: RecursosLeidos;
}

interface TamanoVentana {
    ancho: number;
    alto: number;
}

const useWindowLoad = (): boolean => {
    const [isLoaded, setWindowLoad] = useState({
        loaded: false,
    });

    useEffect(() => {
        function handleLoading(): void {
            setWindowLoad({
                loaded: true,
            });
        }

        window.addEventListener('load', handleLoading);

        return (): void => window.removeEventListener('load', handleLoading);
    }, []);

    return isLoaded.loaded;
};

const useWindowSize = (): TamanoVentana => {
    const [windowSize, setWindowSize] = useState({
        ancho: undefined,
        alto: undefined,
    });

    useEffect(() => {
        function handleResize(): void {
            setWindowSize({
                ancho: window.innerWidth,
                alto: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

let firstLoaded = false;
const motorGrafico: MotorGrafico = new MotorGrafico();
const ElementoMotor = ({ recursos }: Props): JSX.Element => {
    motorGrafico.inicializarRecursosProgramables(recursos);
    const tamanoVentana: TamanoVentana = useWindowSize();
    const ventanaCargada: boolean = useWindowLoad();

    if (ventanaCargada) {
        if(!firstLoaded) {
            motorGrafico.iniciar('viewport', 512, 512);
            firstLoaded = true;
        }
        motorGrafico.cambiarTamano(tamanoVentana.ancho, tamanoVentana.alto);
    }

    return (
        <React.Fragment>
            <div id="gameArea" style={{
                position: 'absolute',
                left: '50%',
                top: '50%'
            }}>
                <canvas id="viewport" style= {{
                    width: '100%',
                    height: '100%'
                }}></canvas>
            </div>
        </React.Fragment>
    );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const recursos = await lectorRecursos();

    return {
        props: {
            recursos
        },
    };
};



export default ElementoMotor;
