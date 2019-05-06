export const getOptions = {
  method: 'GET',
  credentials: 'same-origin',
  cache: 'no-cache',
  headers: new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
};

/**
 * Randomize array elements using the Fisher-Yates (aka Knuth) Shuffle.
 * https://github.com/Daplie/knuth-shuffle
 */
export const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}