import * as React from 'react';
import * as range from 'lodash/range';
import { observer } from 'mobx-react';
import { Store } from './store';


const Component = observer(() => {
    const { content } = Store.state;
    if (!content) {
        return null;
    }
    return (
        <div style={{
            position: 'fixed',
            color: '#454545',
            background: '#ffffff',
            border: '1px solid #454545',
            top: '50%',
            left: '50%',
            padding: '3px 10px',
            marginLeft: (1 - 30 * 7.6) / 2 - 10,
            marginTop: -46
        }} >
            {content}
        </div>
    );
});


interface UploadProps {
    onLoad: (content: ArrayBuffer) => void;
}

function UploadFile(props: UploadProps) {
    let el: HTMLInputElement | null = null;
    return (
        <input
            type="file"
            ref={e => {
                el = e;
                el && el.click();
            }}
            onChange={() => el && el.files && onFileSelect(el.files[0], props.onLoad)}
        />
    );
}

function onFileSelect(file: File, handler: (content: ArrayBuffer) => void) {
    const reader = new FileReader();
    reader.onload = e => e.target && handler((e.target as any).result);
    reader.readAsArrayBuffer(file);
}


export class Html extends React.Component {

    componentDidMount() {
        window.removeEventListener('resize', () => Store.setSize());
    }

    parseContent = (buffer: ArrayBuffer) => {
        readCelestiaStarsFormat(buffer);
    }

    render() {
        return (
            <React.Fragment>
                <UploadFile onLoad={this.parseContent} />
                <Component />
            </React.Fragment>
        );
    }
}

function readCelestiaStarsFormat(buffer: ArrayBuffer) {
    const data = new Uint8Array(buffer);
    const dataView = new DataView(buffer);
    let index = 0;

    // 4-byte old format number of records (32)
    console.log(dataView.getUint32(index));
    // 4-byte old format catalog number (32) 0=Sol
    console.log(dataView.getUint32(index + 4));
    getOldFormatStarInfo(dataView, index + 8);

    // 8-byte string (64)
    console.log(range(7).map((_, i) => String.fromCharCode(data[i * 8])).join(''));
    index += 8;

    // 2-byte version (16)
    console.log(dataView.getUint16(index));
    index += 2;

    // 4-byte number of records (32)
    console.log(dataView.getUint32(index));
    index += 4;

    // 4-byte catalog number (32) 0=Sol
    console.log(dataView.getUint32(index));
    index += 4;

    range(100).forEach(i => getStarInfo(dataView, index + i * 20));
}

function getStarInfo(dataView: DataView, start: number) {
    let offset = start;
    // 4-byte unsigned integer   Hipparcos catalog number (=0 for Sol)
    console.log('Hipparcos catalog number (=0 for Sol)', dataView.getUint32(offset));
    offset += 4;
    // 4-byte floating point     x-coordinate in light years
    console.log('x-coordinate in light years', dataView.getFloat32(offset));
    offset += 4;
    // 4-byte floating point     y-coordinate in light years
    console.log('y-coordinate in light years', dataView.getFloat32(offset));
    offset += 4;
    // 4-byte floating point     z-coordinate in light years
    console.log('z-coordinate in light years', dataView.getFloat32(offset));
    offset += 4;
    // 2-byte signed integer     absolute magnitude * 256
    console.log('absolute magnitude * 256', dataView.getInt16(offset));
    offset += 2;
    // 2-byte unsigned integer   spectral class
    console.log('spectral class', dataView.getUint16(offset));
}

function getOldFormatStarInfo(dataView: DataView, start: number) {
    let offset = start;
    // 4-byte unsigned integer   Hipparcos catalog number
    console.log('Hipparcos catalog number', dataView.getUint32(offset));
    offset += 4;
    // 4-byte unsigned integer   HD catalog number
    console.log('HD catalog number', dataView.getUint32(offset));
    offset += 4;
    // 4-byte floating point     Right Ascension in degrees
    console.log('Right Ascension in degrees', dataView.getFloat32(offset));
    offset += 4;
    // 4-byte floating point     Declination in degrees
    console.log('Declination in degrees', dataView.getFloat32(offset));
    offset += 4;
    // 4-byte floating point     Parallax (in milliarcseconds?)
    console.log('Parallax (in milliarcseconds?)', dataView.getFloat32(offset));
    offset += 4;
    // 2-byte signed integer     Apparent magnitude * 256
    console.log('Apparent magnitude * 256', dataView.getInt16(offset));
    offset += 2;
    // 2-byte unsigned integer   Spectral class
    console.log('Spectral class', dataView.getUint16(offset));
    offset += 2;
    // 1-byte unsigned integer   Parallax error * 200
    console.log('Parallax error * 200', dataView.getUint8(offset));
}
