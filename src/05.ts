import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('05');
  const puzzle = new Puzzle('32', logger);

  // Mock Data
  // const distances: {
  //   [key: string]: number;
  // } = {
  //   'base+ta00': 55457,
  //   'base+cx22': 63529,
  //   'base+xj84': 61302,
  //   'ta00+base': 55457,
  //   'ta00+cx22': 111890,
  //   'ta00+xj84': 35768,
  //   'cx22+base': 63529,
  //   'cx22+ta00': 111890,
  //   'cx22+xj84': 98977,
  //   'xj84+base': 61302,
  //   'xj84+ta00': 35768,
  //   'xj84+cx22': 98977,
  // };

  // const journey: string[][] = [
  //   ['base', 'cx22', 'ta00', 'base', 'xj84', 'base'],
  // ];

  // Real Data
  const rawData: string[] = await puzzle.getPuzzle();
  const distanceKey = rawData[0].split('  ').filter(x => x !== '');

  const distancesArray = rawData
    .slice(1, -12)
    .filter(x => x !== '')
    .map(x => {
      const y = x.split('  ').filter(x => x !== '');

      const baseKey = y[0];
      const value = y.slice(1).map(z => Number(z));

      const obj: {[key: string]: number} = {};
      value.forEach((z, j) => {
        obj[`${baseKey}+${distanceKey[j]}`] = z;
      });

      return obj;
    });

  const distances = distancesArray.reduce((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  });

  const journey = rawData
    .slice(-11)
    .filter(x => x !== '')
    .map(x =>
      x
        .split(': ')
        .filter(x => x !== '')[1]
        .split(' -> ')
    );

  //--------------- Process the data.
  logger.log('Processing data...');

  let totalDistance = 0;

  journey.forEach(j => {
    // Sum the distance between each pair of locations
    for (let k = 0; k < j.length - 1; k++) {
      logger.log(j[k], j[k + 1], distances[`${j[k]}+${j[k + 1]}`].toString());
      totalDistance += distances[`${j[k]}+${j[k + 1]}`];
    }
  });

  //--------------- Log the result
  logger.log('===========================================');
  logger.log(`Total distance traveled: ${totalDistance}`);
})();
