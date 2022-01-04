export const getRandomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const getRandomBoolean = () => {
    return Math.random() >= 0.5;
};

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const scriptIsLoaded = (url) => {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0, n = scripts.length; i < n; i++) {
        if (scripts[i].src === url) {
            return true;
        }
    }

    return false;
};

export const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.substring(1);

export const stringToIntArray = (str) => { // string  must include numbers separated by spaces or commas
    const numArray = [];
    for (let element of str.trim().split(/[ ,]+/) ) { // split by comma or white spac
        const number = parseInt(element);
        if (number) {
            numArray.push(number);
        }
    }
    return numArray;
}

// code from: https://redstapler.co/javascript-weighted-random/
export const  weightedRandom = ( weightData ) => { // parameter in format like: {0:0.6, 1:0.1, 2:0.1, 3:0.2}) -  the sum of weights must be 1
    let value, sum=0, r=Math.random();
    for (value in weightData) {
        sum += weightData[value]; // add the weight
        if (r <= sum) return value;
    }
    // if nothing found, return random element
    const arr = Object.keys(weightData);
    return getRandomElementFromArray(arr);
}

// Deep clones an object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

export const arraysAreEqual = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val) => b.includes(val));
};

export const simplify = (string) => {
    if (typeof(string)==="string") {
     return string.trim().replace(/\s\s+/g, ' ');
    } else {
        return string;
    }
}

export const isDigit = char => /^\d+$/.test(char);
