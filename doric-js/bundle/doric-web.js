'use strict';

"use strict";
function _arrayBufferToBase64(arrayBuffer) {
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    let a, b, c, d;
    let chunk;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '==';
    }
    else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return base64;
}
function _base64ToArrayBuffer(v) {
    const binary_string = window.atob(v);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
function _wrappedValue(v) {
    switch (typeof v) {
        case "number":
            return {
                type: "number",
                value: v
            };
        case "string":
            return {
                type: "string",
                value: v
            };
        case "boolean":
            return {
                type: "boolean",
                value: v
            };
        case "object":
            if (v instanceof ArrayBuffer) {
                return {
                    type: "arrayBuffer",
                    value: _arrayBufferToBase64(v)
                };
            }
            else if (v instanceof Array) {
                return {
                    type: "array",
                    value: JSON.stringify(v)
                };
            }
            else {
                return {
                    type: "object",
                    value: JSON.stringify(v)
                };
            }
        default:
            return {
                type: "null",
                value: undefined
            };
    }
}
function _rawValue(v) {
    switch (v.type) {
        case "number":
            return v.value;
        case "string":
            return v.value;
        case "boolean":
            return v.value;
        case "object":
        case "array":
            if (typeof v.value === 'string') {
                return JSON.parse(v.value);
            }
            return v.value;
        case "arrayBuffer":
            const data = NativeClient.fetchArrayBuffer(v.value);
            return _base64ToArrayBuffer(data);
            ;
        default:
            return undefined;
    }
}
function __injectGlobalObject(name, args) {
    Reflect.set(window, name, JSON.parse(args));
}
function __injectGlobalFunction(name) {
    Reflect.set(window, name, function () {
        const args = [];
        for (let i = 0; i < arguments.length; i++) {
            args.push(_wrappedValue(arguments[i]));
        }
        const ret = NativeClient.callNative(name, JSON.stringify(args));
        return _rawValue(JSON.parse(ret));
    });
}
function __invokeMethod(objectName, functionName, stringifiedArgs) {
    // NativeClient.log(`invoke:${objectName}.${functionName}(${stringifiedArgs})`)
    try {
        const thisObject = Reflect.get(window, objectName);
        const thisFunction = Reflect.get(thisObject, functionName);
        const args = JSON.parse(stringifiedArgs);
        const rawArgs = args.map(e => _rawValue(e));
        const ret = Reflect.apply(thisFunction, thisObject, rawArgs);
        const returnVal = ret ? JSON.stringify(_wrappedValue(ret)) : "";
        // NativeClient.log(`return:${returnVal}`)
        NativeClient.returnNative(returnVal);
    }
    catch (e) {
        NativeClient.log(`error:${e},${e.stack}`);
        NativeClient.returnNative("");
    }
}
function _prepared() {
    window.setTimeout = Reflect.get(window, "doricSetTimeout");
    window.setInterval = Reflect.get(window, "doricSetInterval");
    window.clearTimeout = Reflect.get(window, "doricClearTimeout");
    window.clearInterval = Reflect.get(window, "doricClearInterval");
}
