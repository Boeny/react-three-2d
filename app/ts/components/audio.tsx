import * as React from 'react';


interface IStore {
    context: AudioContext | null;
    source: OscillatorNode | null;
}

export const AudioStore: IStore = {
    context: null,
    source: null
};


export class Audio extends React.Component {

    componentDidMount() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        AudioStore.context = new AudioContext();
    }

    render() {
        return null;
    }
}


export class AudioSource extends React.Component {

    componentDidMount() {
        const { context } = AudioStore;
        if (context === null) {
            console.warn('no audio context!');
            return;
        }
        AudioStore.source = context.createOscillator();
        AudioStore.source.frequency.value = 100;

        const analyser = context.createAnalyser();
        // Размерность преобразования Фурье
        // Если не понимаете, что это такое - ставьте 512, 1024 или 2048 ;)
        analyser.fftSize = 2048;
        // Создаем массивы для хранения данных
        const fFrequencyData = new Float32Array(analyser.frequencyBinCount);
        const bFrequencyData = new Uint8Array(analyser.frequencyBinCount);
        const bTimeData = new Uint8Array(analyser.frequencyBinCount);

        AudioStore.source.connect(analyser);
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
