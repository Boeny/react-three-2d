import * as React from 'react';
import { setMapData } from '~/components/map/store';
import { getBinaryInfo, Star, getTextInfo } from './utils';
import { Sphere } from '~/components/map/types';


export function UploadFile() {
    let input: HTMLInputElement | null = null;
    return (
        <input
            type="file"
            ref={el => input = el}
            onChange={() => input && input.files && input.files[0]
                && onFileSelect(input.files[0], applyContent)}
        />
    );
}

function getExt(fileName: string): string {
    const arr = fileName.split('.');
    return arr[arr.length - 1];
}

function onFileSelect(file: File, handler: (stars: Star[]) => void) {
    const reader = new FileReader();
    const isText = getExt(file.name) === 'txt';
    reader.onload = e => {
        if (!e.target) {
            return;
        }
        const result = (e.target as any).result;
        let stars: Star[] = [];
        try {
            stars = isText ? getTextInfo(result) : getBinaryInfo(new DataView(result));
        } catch (e) {
            console.warn(e.message);
            stars = [];
        }
        handler(stars);
    };
    if (isText) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function applyContent(data: Star[]) {
    setMapData(data.filter(filterByDistance).map(convertStarToSphere).filter(excludeZero));
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
        position: { x: star.position.x, y: star.position.y, z: star.position.z }
    };
}

const MAX_DISTANCE = 100;

function checkPosition(n: number): boolean {
    return n <= MAX_DISTANCE && n >= -MAX_DISTANCE;
}
