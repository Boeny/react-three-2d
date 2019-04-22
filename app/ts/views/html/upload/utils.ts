import { Vector3 } from 'three';
import { STAR_TYPES, SPECTRAL_TYPES, LUM_CLASSES } from './constants';


export function getTextInfo(text: string) {
    return text.replace('\r', '').split('\n').filter(s => s !== '').map(getTextStarInfo);
}

function getTextStarInfo(row: string): Star {
    const data = row.replace('  ', ' ').split(' ');
    const result = new Star();
    result.catalogNumber = parseNumber(data[0]);
    result.position = new Vector3(parseNumber(data[1]), parseNumber(data[2]), parseNumber(data[3]));
    result.absMagnitude = parseNumber(data[4]);
    const { type, spectralClass } = getSpectralClassFromText(data[5]);
    result.type = type;
    result.spectral = spectralClass;
    return result;
}

function parseNumber(str: string): number {
    return parseInt(str.replace('+', ''), 10) || 0;
}

function getSpectralClassFromText(spectralClass: string)  {
    if (spectralClass.includes('/')) {
        return {
            type: StarTypes.normal,
            spectralClass: {
                type: 'unknown',
                subType: spectralClass,
                luminosity: ''
            }
        };
    }
    const dwarfType = SPECTRAL_TYPES[StarTypes.dwarf].filter(s => spectralClass.includes(s))[0] || null;
    if (dwarfType) {
        return {
            type: StarTypes.dwarf,
            spectralClass: {
                type: dwarfType,
                subType: spectralClass.replace(dwarfType, ''),
                luminosity: ''
            }
        };
    }
    const luminosity = spectralClass.includes('sd') ? 'VI (sd)' :
        LUM_CLASSES.filter(s => spectralClass.includes(s))[0] || '';
    let other = spectralClass.replace('.', '');
    if (luminosity) {
        other = other.replace(luminosity, '');
    }
    const type = SPECTRAL_TYPES[StarTypes.normal].filter(s => other.includes(s))[0] || '';
    return {
        type: StarTypes.normal,
        spectralClass: {
            type,
            luminosity,
            subType: type ? other.replace(type, '') : other
        }
    };
}

function range(count: number): number[] {
    return Array.apply(null, Array(count)).map((_, i) => i);
}

export function getBinaryInfo(dataView: DataView): Star[] {
    let index = 0;
    // 8-byte string (64)
    const msg = range(8).map((_, i) => String.fromCharCode(dataView.getUint8(i))).join('');
    console.log(msg);
    if (msg !== 'CELSTARS') {
        console.warn('there is no Celestia stars archive after 1.4.0!');
        return [];
    }
    index += 8;
    // 2-byte version (16)
    console.log('version:', dataView.getUint16(index));
    index += 2;
    // 4-byte number of records (32)
    console.log('number of records:', dataView.getUint32(index));
    index += 4;
    // 4-byte catalog number (32) 0=Sol
    console.log('catalog number:', dataView.getUint32(index));
    index += 4;
    const result: Star[] = [];
    while (index < dataView.byteLength + 20) {
        const item = new Star();
        try {
            index = getStarInfo(dataView, index, item);
        } catch (e) {
            break;
        }
        result.push(item);
    }
    return result;
}

export class Star {

    catalogNumber = 0;
    position = new Vector3();
    absMagnitude = 0;
    type: StarTypes = StarTypes.normal;
    spectral = { type: '', subType: '', luminosity: '' };

    toString(): string {
        return [
            `Hipparcos catalog number (=0 for Sol): ${this.catalogNumber}`,
            `x-coordinate in light years: ${this.position.x}`,
            `y-coordinate in light years: ${this.position.y}`,
            `z-coordinate in light years: ${this.position.z}`,
            `absolute magnitude * 256: ${this.absMagnitude}`,
            `type: ${getStarType(this.type)}`,
            `spectral class: ${this.spectral.type}${this.spectral.subType}${this.spectral.luminosity}`
        ].join('\r\n');
    }
}

function getStarInfo(dataView: DataView, start: number, result: Star) {
    let offset = start;
    // 4-byte unsigned integer (32)
    result.catalogNumber = dataView.getUint32(offset);
    offset += 4;
    // 4-byte floating point (32)
    const x = dataView.getFloat32(offset);
    offset += 4;
    // 4-byte floating point (32)
    const y = dataView.getFloat32(offset);
    offset += 4;
    // 4-byte floating point (32)
    const z = dataView.getFloat32(offset);
    result.position = new Vector3(x, y, z);
    offset += 4;
    // 2-byte signed integer (16)
    result.absMagnitude = dataView.getInt16(offset);
    offset += 2;
    // 2-byte unsigned integer (16)
    const { type, spectralClass } = getSpectralClass(dataView.getUint16(offset));
    result.type = type;
    result.spectral = spectralClass;
    return offset + 2;
}

export function getSpectralClass(n: number) {
    const KT = getUpperByte(n);
    const SL = getLowerByte(n);
    const K: StarTypes = getUpperHalfOfByte(KT); // king of object
    const T = getLowerHalfOfByte(KT); // spectral type (K=normal or dwarf)
    const S = getUpperHalfOfByte(SL); // spectral subtype (K=normal or dwarf)
    const L = getLowerHalfOfByte(SL); // luminosity class (K=normal)
    return {
        type: K,
        spectralClass: {
            type: getSpectralType(K, T),
            subType: getSpectralSubType(K, S),
            luminosity: getLuminocityClass(K, L)
        }
    };
}

export enum StarTypes {
    normal,
    dwarf,
    neutron,
    blackhole
}

function getArrayElement<T>(arr: T[], i: number, def: T): T {
    return arr[i] === undefined ? def : arr[i];
}

function getStarType(starType: StarTypes): string {
    return getArrayElement(STAR_TYPES, starType, 'unknown');
}

function getSpectralType(starType: StarTypes, spectralType: number): string {
    if (starType === StarTypes.normal || starType === StarTypes.dwarf) {
        return getArrayElement(SPECTRAL_TYPES[starType], spectralType, 'unknown');
    }
    return '';
}

function getSpectralSubType(starType: StarTypes, spectralSubType: number): string {
    if (starType === StarTypes.normal || starType === StarTypes.dwarf) {
        return spectralSubType > 9 ? 'unknown' : String(spectralSubType);
    }
    return '';
}

function getLuminocityClass(starType: StarTypes, luminocity: number): string {
    return starType === StarTypes.normal ? getArrayElement(LUM_CLASSES, luminocity, 'unknown') : '';
}

export function getUpperByte(n: number): number {
    return n >>> 8;
}

export function getLowerByte(n: number): number {
    return n & 0x00FF;
}

export function getUpperHalfOfByte(n: number): number {
    return n >>> 4;
}

export function getLowerHalfOfByte(n: number): number {
    return n & 0x0F;
}
