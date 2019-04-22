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

function onFileSelect(file: File, handler: (content: Star[]) => void) {
    if (getExt(file.name) === 'txt') {
        onTextFileSelect(file, handler);
    } else {
        onBinaryFileSelect(file, handler);
    }
}

function onBinaryFileSelect(file: File, handler: (content: Star[]) => void) {
    const reader = new FileReader();
    reader.onload = e => e.target && handler(
        getBinaryInfo(new DataView((e.target as any).result))
    );
    reader.readAsArrayBuffer(file);
}

function onTextFileSelect(file: File, handler: (content: Star[]) => void) {
    const reader = new FileReader();
    reader.onload = e => e.target && handler(
        getTextInfo((e.target as any).result)
    );
    reader.readAsText(file);
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
        position: { x: Math.round(star.position.x), y: Math.round(star.position.y), z: Math.round(star.position.z) }
    };
}

const MAX_DISTANCE = 100;

function checkPosition(n: number): boolean {
    return n <= MAX_DISTANCE && n >= -MAX_DISTANCE;
}
