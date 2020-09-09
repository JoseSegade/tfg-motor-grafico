import React, { useState, useEffect } from 'react';
import MotorGrafico from 'core/motorGrafico';
import { GetStaticProps } from 'next';
import lectorRecursos, { RecursosLeidos } from 'core/importadores/lectorRecursos';

interface props {
    recursos: RecursosLeidos;
}

interface TamanoVentana {
    ancho: number;
    alto: number;
}

const ElementoMotor = ({ recursos }: props): JSX.Element => {
    const motorGrafico: MotorGrafico = new MotorGrafico(512, 512);
    motorGrafico.inicializarRecursosProgramables(recursos);
    const tamanoVentana: TamanoVentana = useWindowSize();
    const ventanaCargada: boolean = useWindowLoad();
    
    if (ventanaCargada) {
        motorGrafico.iniciar('viewport');
    }

    if (motorGrafico) {
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

export const getStaticProps: GetStaticProps<props> = async () => {
    const recursos = await lectorRecursos();

    return {
        props: {
            recursos
        },
    };
};

const useWindowLoad = (): boolean => {
    const [isLoaded, setWindowLoad] = useState({
        loaded: false,
    });

    useEffect(() => {
        function handleLoading() {
            setWindowLoad({
                loaded: true,
            });
        }

        window.addEventListener('load', handleLoading);

        return () => window.removeEventListener('load', handleLoading);
    }, []);

    return isLoaded.loaded;
};

const useWindowSize = (): TamanoVentana => {
    const [windowSize, setWindowSize] = useState({
        ancho: undefined,
        alto: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                ancho: window.innerWidth,
                alto: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

export default ElementoMotor;
