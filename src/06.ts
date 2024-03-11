import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('06');
  const puzzle = new Puzzle('33', logger);

  // Mock Data
  // const input = {
  //   cipher: 'helloworld',
  //   message: 'wp nehslv ewgw',
  // };

  // Real Data
  const rawData: string[] = (await puzzle.getPuzzle()).filter(x => x !== '');
  const input = {
    cipher: rawData[0].replace('Cipher key: ', ''),
    message: rawData[1].replace('Message: ', ''),
  };

  //--------------- Process the data.
  logger.log('Processing data...');

  // Initialize the puzzle
  const spacePosition: number[] = [];

  for (let i = 0; i < input.message.length; i++) {
    if (input.message[i] === ' ') spacePosition.push(i);
  }

  // Create a playfair grid

  const createGrid = (cipher: string) => {
    const alphabet = 'abcdefghiklmnopqrstuvwxyz';
    let key = cipher;
    let grid = '';

    for (let i = 0; i < key.length; i++) {
      if (key[i] === 'j') {
        key = key.replace('j', 'i');
      }
    }

    for (let i = 0; i < key.length; i++) {
      if (grid.indexOf(key[i]) === -1) {
        grid += key[i];
      }
    }

    for (let i = 0; i < alphabet.length; i++) {
      if (grid.indexOf(alphabet[i]) === -1) {
        grid += alphabet[i];
      }
    }

    return grid;
  };

  // Decode the message

  const decode = (cipher: string, message: string) => {
    let decoded = '';

    const grid = createGrid(cipher);
    logger.log('Grid:', grid);

    const pairs = message.match(/(\w{2})/g)!;

    for (let i = 0; i < pairs.length; i++) {
      let first = pairs[i][0];
      let second = pairs[i][1];

      const firstIndex = grid.indexOf(first);
      const secondIndex = grid.indexOf(second);

      const firstRow = Math.floor(firstIndex / 5);
      const firstCol = firstIndex % 5;
      const secondRow = Math.floor(secondIndex / 5);
      const secondCol = secondIndex % 5;

      if (firstRow === secondRow) {
        first = grid[firstRow * 5 + ((firstCol + 4) % 5)];
        second = grid[secondRow * 5 + ((secondCol + 4) % 5)];
      } else if (firstCol === secondCol) {
        first = grid[((firstRow + 4) % 5) * 5 + firstCol];
        second = grid[((secondRow + 4) % 5) * 5 + secondCol];
      } else {
        first = grid[firstRow * 5 + secondCol];
        second = grid[secondRow * 5 + firstCol];
      }

      decoded += first + second;
      logger.log(`Decoded (${i + 1}/${pairs.length}) :`, decoded);
    }

    // Add spaces back
    for (let i = 0; i < spacePosition.length; i++) {
      decoded =
        decoded.slice(0, spacePosition[i]) +
        ' ' +
        decoded.slice(spacePosition[i]);
    }

    return decoded;
  };

  const result = decode(input.cipher, input.message);

  //--------------- Log the result
  logger.log('===========================================');
  logger.log('Answer:', result);
})();
