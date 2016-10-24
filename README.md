# memory-game

Memory Game is a coding exercise and nothing more. It's based on the classic
card matching game from Milton Bradley.

## Setup

Install the latest version of nodejs and gulp-cli globally. Next, clone or
download the memory-game repository. From within the memory-game directory, run
the command `gulp serve`. Follow the command output, but it should be available
to view on localhost:3000.

It only works in chrome at the moment.

## Testing

To cheat for testing, open src/views/card/card.less and comment the property
transform: rotateY(180deg); for the .Card-front class and uncomment
transform: rotateY(180deg); for the .Card-back class.
