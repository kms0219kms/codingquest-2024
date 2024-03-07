import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('01');
  const puzzle = new Puzzle('28', logger);

  // Mock Data
  // const input = [
  //   {
  //     Spaceliner: 'AAA',
  //     Type: 'Seat',
  //     Price: 9997,
  //   },
  //   {
  //     Spaceliner: 'BBB',
  //     Type: 'Discount',
  //     Price: 2886,
  //   },
  //   {
  //     Spaceliner: 'DDD',
  //     Type: 'Luggage',
  //     Price: 3500,
  //   },
  //   {
  //     Spaceliner: 'AAA',
  //     Type: 'Tax',
  //     Price: 156,
  //   },
  //   {
  //     Spaceliner: 'CCC',
  //     Type: 'Fee',
  //     Price: 9468,
  //   },
  //   {
  //     Spaceliner: 'BBB',
  //     Type: 'Fee',
  //     Price: 9378,
  //   },
  //   {
  //     Spaceliner: 'AAA',
  //     Type: 'Discount',
  //     Price: 3103,
  //   },
  //   {
  //     Spaceliner: 'DDD',
  //     Type: 'Rebate',
  //     Price: 967,
  //   },
  // ];

  // Real Data
  const rawData: string[] = await puzzle.getPuzzle();
  const input = rawData
    .map(line => {
      const [Spaceliner, Type, Price] = line.replace(':', '').split(' ');

      return {
        Spaceliner,
        Type,
        Price: parseInt(Price),
      };
    })
    .filter(x => x.Spaceliner);

  //--------------- Process the data.
  logger.log('Processing data...');

  const value: {
    [key: string]: number;
  } = {};

  for (let i = 0; i < input.length; i++) {
    const spaceliner = input[i].Spaceliner;
    const type = input[i].Type;
    const price = input[i].Price;

    if (!value[spaceliner]) value[spaceliner] = 0;

    if (type === 'Discount' || type === 'Rebate') {
      value[spaceliner] -= price;
    } else {
      value[spaceliner] += price;
    }
  }

  for (const key in value) {
    value[key] = Math.abs(value[key]);
    logger.log(`Company: ${key}, Total Cost: ${value[key]}`);
  }

  //--------------- Log the result
  logger.log('===========================================');

  const cheapest = Object.keys(value).reduce((a, b) =>
    value[a] < value[b] ? a : b
  );
  logger.log(`Cheapest Company: ${cheapest}, Answer: ${value[cheapest]}`);
})();
