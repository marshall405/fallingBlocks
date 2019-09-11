function randomNumber(min, max) {
    if (min > max) {
        console.error('randomNumber() arguments - [min, max]');
        return;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
