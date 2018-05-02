

export function AudioComponent(volume: number) {
    // const context = new AudioContext();
    // const oscillator = context.createOscillator();
    // oscillator.type = 'sine';
    // oscillator.frequency.value = 500;
    // oscillator.connect(context.destination);

    // Создаем буффер длинной N sec
    const buffer = createBuffer(500);
    // Получаем частоту ноты ДО 3-ей октавы
    const note = getNote('C-3');

    // Синтез тона
    // synthTone(buffer, 0, 1, note, volume, sin);         // Синусоидальная волна
    // synthTone(buffer, 2, 1, note, volume, saw);         // Пилообразная волна
    // synthTone(buffer, 4, 1, note, volume, triangle);    // Треугольная волна
    synthTone(buffer, 0, 0.1, note, volume, flat);        // Прямоугольная волна
    // synthTone(buffer, 8, 1, note, volume, noise);       // Шум

    createAudio(buffer).play();
    return null;
}

// Количество семплов в одной секунде
const SAMPLE_FREQUENCY = 44100;
// Максимальная амплитуда волны
const MAX_AMPLITUDE = 22000;
// PI
const PI = Math.PI;
const PI_2 = PI * 2;

/******************************************************************************/

/**
 * Создание буфера данных
 * @param {number} millisecond - длинна буффера в милиссекундах
 * @returns {Int16Array} Подготовленный буффер
 */
function createBuffer(millisecond: number): Int16Array {
    const waveBytes = SAMPLE_FREQUENCY * 4 * millisecond / 1000;
    return new Int16Array(new ArrayBuffer(waveBytes));
}

/**
 * Создание объекта Audio с Wave Data переданным в buffer
 * @param   {Int16Array} buffer Буффер в который производится запись
 * @returns {Audio} Объект 'Audio'
 */
function createAudio(buffer: Int16Array): HTMLMediaElement {
    const bufferLen = buffer.length;
    const audioData = [];
    const fromCharCode = String.fromCharCode;

    for (let i = 0; i < bufferLen; i += 1) {
        const b = buffer[i] / MAX_AMPLITUDE * 0x7800;
        audioData.push(fromCharCode(b & 255, (b >> 8) & 255));
    }

    return new Audio('data:audio/wav;base64,' +
        btoa(atob('UklGRti/UABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YbS/UAA') + audioData.join('')));
}

/**
 * Синтез тона
 * @param   {Int16Array} buffer Буффер Wave данных
 * @param   {number}     start  Место начала сигнага
 * @param   {number}     length Длинна сигнала
 * @param   {number}     freq   Частота сигнала
 * @param   {number}     volume Громкость сигнала (От 0 до 1)
 * @param   {function}   func   Функция - форма волны
 * @returns {Int16Array} Буффер Wave данных
 */

function synthTone(
    buffer: Int16Array,
    start: number,
    length: number,
    freq: number,
    volume: number,
    func: (index: number, frequency: number) => number
) {
    const start2 = start * SAMPLE_FREQUENCY * 2;
    const length2 = length * SAMPLE_FREQUENCY * 2;
    const freq2 = freq / SAMPLE_FREQUENCY;
    const volume2 = volume * 32767;

    for (let i = 0; i < length2; i += 1) {
        buffer[start2 + i] = func(start2 + i, freq2) * volume2;
    }

    return buffer;
}

/* Форма волны ****************************************************************/

/**
 * Синусоидальная функция волны
 * @param   {number} index     Номер текущего фрейма
 * @param   {number} frequency Частота сигнала
 * @returns {number} Значение сигнала в момент времени
 */
function sin(index: number, frequency: number): number {
    return Math.sin(PI_2 * frequency * index);
}

/**
 * Пилообразная функция волны
 * @param   {number} index     Номер текущего фрейма
 * @param   {number} frequency Частота сигнала
 * @returns {number} Значение сигнала в момент времени
 */
function saw(index: number, frequency: number): number {
    return 2.0 * (index * frequency - Math.floor(index * frequency)) - 1.0;
}

/**
 * Треугольная функция волны
 * @param   {number} index     Номер текущего фрейма
 * @param   {number} frequency Частота сигнала
 * @returns {number} Значение сигнала в момент времени
 */
function triangle(index: number, frequency: number): number {
    return 2.0 * Math.abs(2.0 * (index * frequency - Math.floor(index * frequency + 0.5))) - 1.0;
}

/**
 * Прямоугольная функция волны
 * @param   {number} index     Номер текущего фрейма
 * @param   {number} frequency Частота сигнала
 * @returns {number} Значение сигнала в момент времени
 */
function flat(index: number, frequency: number): number {
    return (Math.sin(frequency * index) > 0) ? 1 : -1;
}

/**
 * Функция волны типа "Шум"
 * @returns {number} Значение сигнала в момент времени
 */
function noise(): number {
    return Math.random();
}

/* Ноты **********************************************************************/

/**
 * Опредиление частоты звучания ноты по ее номеру и октаве
 * @param   {number} key    Номер ноты
 * @param   {number} octave Номер октавы
 * @returns {number} Частота сигнала
 */
function noteToFreq(key: number, octave: number): number {
    if (key === 0) return 0;
    return 27.5 * Math.pow(2, (key + octave * 12.0) / 12.0);
}

/**
 * Опредиление частоты звучания ноты по ее строчной записи
 * @param   {string} str Строчная запись ноты
 * @returns {number} Чостота сигнала
 */
function getNote(str: string): number {
    const symb = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
    const note = symb.indexOf(str.substr(0, 2));
    const octave = parseInt(str.substr(2, 1), 10);

    return noteToFreq(note + 1, octave);
}
