import * as React from 'react';
import { setMapData } from '~/components/map/store';
import { getCelestiaStarsInfo, Star } from './utils';
import { Sphere } from '~/components/map/types';


export function UploadFile() {
    let input: HTMLInputElement | null = null;
    return (
        <input
            type="file"
            ref={el => {
                input = el;
                if (el) {
                    debugger;
                    el.click();
                }
            }}
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
    setMapData(getCelestiaStarsInfo(new DataView(buffer)).map(convertStarToSphere));
}

function convertStarToSphere(star: Star): Sphere {
    return {
        radius: 1,
        position: star.position
    };
}
