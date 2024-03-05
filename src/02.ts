import {Logger, Puzzle} from './lib';

//--------------- Main logic
(async () => {
  const logger = new Logger('02');
  const puzzle = new Puzzle('29', logger);

  // Mock Data
  // const packetRaw = [
  //   '45000377000000008306f39f0A000bc1d7253441',
  //   '4500007f0000000005065de1c0a800b833c555ee',
  //   '450002e50000000008061ef5c0a8796698721661',
  //   '4500017e00000000b206e54e88c7fd4f0A00244c',
  //   '45000164000000009d06d73c0A0000b7e0b143b8',
  // ];

  // Real Data
  const packetRaw: string[] = await puzzle.getPuzzle();

  //--------------- Process the data
  logger.log('Processing data...');

  let internalBytes = 0;
  let externalBytes = 0;
  let unusedBytes = 0;

  packetRaw.map((packet: string) => {
    const buffer = Buffer.from(packet, 'hex');

    if (buffer.length < 20) {
      return;
    }

    const sourceIP = buffer.subarray(12, 16).join('.');
    const destIP = buffer.subarray(16, 20).join('.');

    const totalLength = buffer.subarray(0, 20).readUInt16BE(2);

    logger.log(
      `${packet} - Length ${totalLength} bytes, source IP address ${sourceIP}, destination ${destIP}`
    );

    if (sourceIP.startsWith('192.168.') || destIP.startsWith('192.168.')) {
      internalBytes += totalLength;
    } else if (sourceIP.startsWith('10.0.') || destIP.startsWith('10.0.')) {
      externalBytes += totalLength;
    } else {
      unusedBytes += totalLength;
    }
  });

  //--------------- Log the result
  logger.log('===========================================');
  logger.log(
    `Answer: ${internalBytes}/${externalBytes}, Unused: ${unusedBytes}`
  );
})();
