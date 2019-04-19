import 'mocha';
import { expect } from 'chai';
import {
    getSpectralClass, getUpperByte, getLowerByte, getUpperHalfOfByte, getLowerHalfOfByte, StarTypes
} from './utils';


describe('Util functions for star catalog', () => {
    it('should return correct spectral class', () => {
        expect(getSpectralClass(0x0426)).to.deep.equal({
            type: StarTypes.normal,
            spectralClass: { type: 'G', subType: '2', luminosity: 'V' }
        });
    });
    it('should return upper byte', () => {
        expect(getUpperByte(0x0426)).to.equal(4);
    });
    it('should return lower byte', () => {
        expect(getLowerByte(0x0426)).to.equal(0x26);
    });
    it('should return upper half of byte', () => {
        expect(getUpperHalfOfByte(0x04)).to.equal(0);
        expect(getUpperHalfOfByte(0x26)).to.equal(2);
    });
    it('should return lower half of byte', () => {
        expect(getLowerHalfOfByte(0x04)).to.equal(4);
        expect(getLowerHalfOfByte(0x26)).to.equal(6);
    });
});
