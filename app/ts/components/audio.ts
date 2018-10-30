import * as React from 'react';


const FREQ_MAX = 10000;
const FREQ_MIN = 100;

export function getFreqFunction(min: number, max: number) {
    const FREQ_MULT = (FREQ_MAX - FREQ_MIN) / (max - min);
    const FREQ_BASE = FREQ_MIN - min * FREQ_MULT;
    return (v: number) => v * FREQ_MULT + FREQ_BASE;
}

interface IStore {
    context: AudioContext | null;
    source: OscillatorNode | null;
}

export const Store: IStore = {
    context: null,
    source: null
};


export class AudioSource extends React.Component {

    componentDidMount() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || null;
        if (!window.AudioContext) {
            console.warn('no audio context!');
            return;
        }
        const context = new AudioContext();
        Store.context = context;
        Store.source = context.createOscillator();

        const analyser = context.createAnalyser();
        // Размерность преобразования Фурье
        // Если не понимаете, что это такое - ставьте 512, 1024 или 2048 ;)
        analyser.fftSize = 2048;
        // Создаем массивы для хранения данных
        const fFrequencyData = new Float32Array(analyser.frequencyBinCount);
        const bFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        const bTimeData = new Uint8Array(analyser.frequencyBinCount);

        Store.source.connect(analyser);
        analyser.connect(context.destination);

        // Получаем данные
        analyser.getFloatFrequencyData(fFrequencyData);
        analyser.getByteFrequencyData(bFrequencyData);
        analyser.getByteTimeDomainData(bTimeData);

        Store.source.frequency.value = 0;
    }

    render() {
        return null;
    }
}
