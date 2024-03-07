import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('04');
  const puzzle = new Puzzle('31', logger);

  // Mock Data
  // const input = [
  //   {
  //     System: 'Proxima Centauri',
  //     Dist: 4.247,
  //     X: 2.945,
  //     Y: -3.056,
  //     Z: -0.143,
  //   },
  //   {
  //     System: "Barnard's star",
  //     Dist: 5.963,
  //     X: 4.958,
  //     Y: 2.98,
  //     Z: 1.449,
  //   },
  //   {
  //     System: 'Luhman 16 A',
  //     Dist: 6.503,
  //     X: 1.697,
  //     Y: -6.249,
  //     Z: 0.6,
  //   },
  //   {
  //     System: 'WISE J085510.83-071442.5',
  //     Dist: 7.532,
  //     X: -3.967,
  //     Y: -5.664,
  //     Z: 2.985,
  //   },
  //   {
  //     System: 'Wolf 359',
  //     Dist: 7.856,
  //     X: -1.916,
  //     Y: -3.938,
  //     Z: 6.522,
  //   },
  // ];

  // Real Data
  const rawData: string[] = await puzzle.getPuzzle();
  const input = rawData
    .slice(1)
    .map(line => {
      const [System, Dist, X, Y, Z] = line.split('  ').filter(x => x !== '');

      return {
        System,
        Dist: parseFloat(Dist),
        X: parseFloat(X),
        Y: parseFloat(Y),
        Z: parseFloat(Z),
      };
    })
    .filter(x => x.System);

  //--------------- Process the data.
  logger.log('Processing data...');

  // Calculate the distance between two stars
  const distance = (x: number, y: number, z: number) => {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  };

  // Create a matrix of distances between stars
  const distances = input.map((star, i) => {
    const dists = input
      .slice(i + 1)
      .map(other =>
        distance(star.X - other.X, star.Y - other.Y, star.Z - other.Z)
      );

    return dists;
  });

  //--------------- Log the result
  logger.log('===========================================');

  // Find the closest pair of stars
  const min = Math.min(...distances.map(dists => Math.min(...dists)));
  const [i, j] =
    distances
      .map((dists, i) => dists.map((d, j) => [i, j, d]))
      .flat()
      .find(([, , d]) => d === min) || [];

  logger.log(
    `Closest pair: ${input[i]?.System} and ${input[j]?.System} at ${min.toFixed(
      3
    )} light years`
  );
})();
