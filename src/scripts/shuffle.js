// fisher-yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export default function shuffle (array) {
    let i = array.length - 1;

    do {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    } while(i--);
}
