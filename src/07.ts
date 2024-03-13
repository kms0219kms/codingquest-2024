import {readFileSync} from 'node:fs';
import {Logger} from './lib';

interface FolderSizeMap {
  [folder: number]: number;
}

interface FolderChildrenMap {
  [folder: number]: Set<number>;
}

//--------------- Main logic
(async () => {
  const logger = new Logger('07');

  // Mock Data
  // const input: string[] = readFileSync('input/07.sample.txt', 'utf-8').split(
  //   '\n'
  // );

  // Real Data
  const input: string[] = readFileSync('input/07.txt', 'utf-8').split('\n');

  // --------------- Process the data.
  logger.log('Processing data...');

  function calculateDeletedBytes(): number {
    // Initialize variables.
    const folder_size: FolderSizeMap = {};
    const file_deletion: FolderSizeMap = {};
    const folder_deletion: Set<number> = new Set();
    const folder_children: FolderChildrenMap = {};

    const delete_re = /delete|temporary/;
    const dir_entry_re = / - ([^ ]+) \[FOLDER (\d+)\]/;
    const file_entry_re = / - ([^ ]+) (\d+)/;

    // Parse the input and populate the data structures.
    let cur_folder = 0;

    for (const line of input) {
      if (line.startsWith('Folder: ')) {
        cur_folder = parseInt(line.replace('Folder: ', ''));
      } else if (line.match(dir_entry_re)) {
        const m = line.match(dir_entry_re)!;
        const folder_num = parseInt(m[2]);

        folder_children[cur_folder] = folder_children[cur_folder] || new Set();
        folder_children[cur_folder].add(folder_num);

        if (delete_re.test(m[1])) {
          folder_deletion.add(folder_num);
        }
      } else if (line.match(file_entry_re)) {
        const m = line.match(file_entry_re)!;
        const file_size = parseInt(m[2]);

        folder_size[cur_folder] = (folder_size[cur_folder] || 0) + file_size;

        if (delete_re.test(m[1])) {
          file_deletion[cur_folder] =
            (file_deletion[cur_folder] || 0) + file_size;
        }
      }
    }

    // Expand folders to be deleted.
    const exploded_folder_deletion: Set<number> = new Set();
    const exploded: Set<number> = new Set();

    while (folder_deletion.size > 0) {
      const folder = folder_deletion.values().next().value;
      folder_deletion.delete(folder);
      exploded_folder_deletion.add(folder);

      const children = folder_children[folder] || new Set();

      for (const child of children) {
        exploded_folder_deletion.add(child);

        if (!exploded.has(child)) {
          folder_deletion.add(child);
        }
      }

      exploded.add(folder);
    }

    // Add up all the deletions.
    const not_deleted = new Set(
      Object.keys(file_deletion)
        .map(Number)
        .filter(folder => !exploded_folder_deletion.has(folder))
    );

    let result = Array.from(exploded_folder_deletion).reduce(
      (acc, folder) => acc + (folder_size[folder] || 0),
      0
    );

    result += Array.from(not_deleted).reduce(
      (acc, folder) => acc + (file_deletion[folder] || 0),
      0
    );

    return result;
  }

  //--------------- Log the result
  logger.log('===========================================');
  logger.log('Total size to be deleted:', calculateDeletedBytes().toString());
})();
