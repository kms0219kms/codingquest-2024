import {mkdirSync, writeFileSync, appendFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';

export class Logger {
  private readonly type: string;
  private readonly logTime: number;

  //--------------- Constructor (initialize)
  constructor(type: string) {
    //--------------- Initialize the variables
    this.type = type;
    this.logTime = new Date().getTime();

    //--------------- Create a log file
    const outDir = join('output');
    const typedOutDir = join(outDir, this.type);
    const outFile = join(typedOutDir, `output-${this.logTime}.txt`);

    if (!existsSync(outDir)) mkdirSync(outDir);
    if (!existsSync(typedOutDir)) mkdirSync(typedOutDir);
    if (!existsSync(outFile)) writeFileSync(outFile, '');
  }

  // Log the message
  public log(...message: string[]) {
    console.log(...message);

    appendFileSync(
      join('output', this.type, `output-${this.logTime}.txt`),
      message.join(' ') + '\n'
    );
  }
}

export default Logger;
