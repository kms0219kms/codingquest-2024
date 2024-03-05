import axios from 'axios';
import {Logger} from './logger';

export class Puzzle {
  private readonly id: string;
  private readonly logger: Logger;

  constructor(id: string, logger: Logger) {
    this.id = id;
    this.logger = logger;
  }

  public async getPuzzle(): Promise<string[]> {
    //--------------- Get the data from the server
    this.logger.log('Requesting data from the codingquest server...');

    const {data} = await axios.get(
      'https://codingquest.io/api/puzzledata?puzzle=' + this.id
    );

    return data.split('\n');
  }
}

export default Puzzle;
