import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('03');
  const puzzle = new Puzzle('30', logger);

  // Mock Data
  // const input = [12, 6, 4, 1, 9, 5, 5, 1, 9, 1, 7];

  // Real Data
  const rawData: string[] = await puzzle.getPuzzle();
  const input = rawData[0].split(' ').map(Number);

  //--------------- Process the data
  let printed = '';

  for (let i = 0; i < input.length; i++) {
    if (i % 2 === 1) {
      for (let j = 0; j < input[i]; j++) {
        printed += '#';
      }
    } else {
      for (let j = 0; j < input[i]; j++) {
        printed += '.';
      }
    }
  }

  //--------------- Log the result
  logger.log('===========================================');

  logger.log(
    printed
      .split(/(.{100})/)
      .filter(x => x)
      .join('\n')
  );
})();
