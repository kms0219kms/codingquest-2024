import {Logger} from './lib';
import {spawn} from 'child_process';

//--------------- Main logic
(async () => {
  const logger = new Logger('08');

  // Mock Data
  // const input = [5, [3, 2, 1]];

  // Real Data
  const input = [856, [40, 12, 2, 1]];

  // --------------- Process the data.
  logger.log('Processing data...');

  // Use python to use more good memory caching and performance
  const python = spawn('python', [
    'src/08.py',
    JSON.stringify(input[0]),
    JSON.stringify(input[1]),
  ]);

  //--------------- Log the result
  logger.log('===========================================');
  python.stdout.on('data', result => logger.log(result.toString()));
})();
