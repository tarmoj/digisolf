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