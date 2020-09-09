import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
    const motorGrafico: MotorGrafico = new MotorGrafico(500, 500);
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
            <Head>
                <title>Typescript Engine</title>
            </Head>
            <div id="gameArea">
                <canvas id="viewport"></canvas>
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
