import * as React from 'react';
import { setMapData } from '~/components/map/store';
import { getCelestiaStarsInfo, Star } from './utils';
import { Sphere } from '~/components/map/types';


export function UploadFile() {
    let input: HTMLInputElement | null = null;
    return (
        <input
            type="file"
            ref={el => input = el}
            onChange={() => input && input.files && input.files[0]
                && onFileSelect(input.files[0], parseContent)}
        />
    );
}

function onFileSelect(file: File, handler: (content: ArrayBuffer) => void) {
    const reader = new FileReader();
    reader.onload = e => e.target && handler((e.target as any).result);
    reader.readAsArrayBuffer(file);
}

function parseContent(buffer: ArrayBuffer) {
    setMapData(
        getCelestiaStarsInfo(new DataView(buffer)).filter(filterByDistance)
            .map(convertStarToSphere).filter(excludeZero)
    );
}

function filterByDistance(item: Star): boolean {
    return checkPosition(item.position.x) && checkPosition(item.position.y) && checkPosition(item.position.z);
}

function excludeZero(item: Sphere): boolean {
    return item.position.x !== 0 || item.position.y !== 0 || item.position.z !== 0;
}

function convertStarToSphere(star: Star): Sphere {
    return {
        radius: 10,
        position: { x: Math.round(star.position.x), y: Math.round(star.position.y), z: Math.round(star.position.z) }
    };
}

const MAX_DISTANCE = 1000;

function checkPosition(n: number): boolean {
    return n <= MAX_DISTANCE && n >= -MAX_DISTANCE;
}
