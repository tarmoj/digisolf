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