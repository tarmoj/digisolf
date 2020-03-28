export const getRandomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const getRandomBoolean = () => {
    return Math.random() >= 0.5;
};