import rgbToHsl from 'rgb-to-hsl';

const colors = {};


colors.hsl2HsldeCONZ = (hsl) => { 

    function hMap(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    
    return {
        h: Math.round(hMap(hsl[0],0,360,0,65535)),
        s: Math.round(hMap(parseInt(hsl[1].slice(0, -1)),0,100,0,255)),
        l: Math.round(hMap(parseInt(hsl[2].slice(0, -1)),0,100,0,255)),
    }
}

colors.rgb2Hsl = (r,g,b) => {
    return rgbToHsl(r, g, b);
}

colors.hex2dec = (hex) => {

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return {
            r:parseInt(result[1], 16),
            g:parseInt(result[2], 16),
            b:parseInt(result[3], 16),
        }
    } 
    return null;

}

export default colors;