import * as React from 'react';


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
        Store.source.frequency.value = 0;

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
    }

    render() {
        return null;
    }
}
