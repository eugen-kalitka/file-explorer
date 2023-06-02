import path from "path";
import fsp from "fs/promises";
import fs from "fs";

class FileActions {
  /**
   * Files/folders removal action
   * */
  static async unlink(files) {
    const errors = [];
    for (const file of files) {
      const fullNodePath = path.join(process.cwd(), 'directory', file.id);
      try {
        await fsp.access(fullNodePath);
        if (file.isDir) {
          await fsp.rm(fullNodePath, { recursive: true, force: true });
        } else {
          await fsp.unlink(fullNodePath);
        }
      } catch (e) {
        errors.push(e);
      }
    }
    if (errors.length) {
      console.log('Error(s) occurred on removing files', errors);
      // TODO send error package to FE
    }
  }

  /**
   * Files/folders movement action
   * */
  static async move(files, destination) {
    const errors = [];
    const fullDestinationPath = path.join(process.cwd(), 'directory', destination);
    for (const file of files) {
      const fullNodePath = path.join(process.cwd(), 'directory', file);
      const nodeDestinationPath = path.join(fullDestinationPath, path.basename(fullNodePath));

      try {
        await fsp.access(fullNodePath);
      } catch (e) {
        // TODO need to check ENOENT error code here
        errors.push(`File ${file} is not available`);
      }
      try {
        await fsp.rename(fullNodePath, nodeDestinationPath);
      } catch (e) {
        errors.push(`Error occurred on renaming file ${file}`);
      }
    }
    if (errors.length) {
      console.log('Error(s) occurred on removing files', errors);
      // TODO send error package to FE
    }
  }

  /**
   * Folder creation action
   * */
  static async createFolder(directoryPath, folderName) {
    const newFolderPath = path.join(process.cwd(), 'directory', directoryPath, folderName);
    console.log(`Creating new folder "${newFolderPath}"...`);
    try {
      await fsp.mkdir(newFolderPath);
      console.log(`Folder "${newFolderPath}" has been successfully created`);
    } catch (e) {
      let errorMessage = `Error occurred on creating folder with "${folderName}" name`;
      if (e.code === 'EEXIST') {
        errorMessage = `The name "${folderName}" is already taken`;
      }
      console.log(errorMessage);
      // TODO send error package on FE
    }
  }
}

export default FileActions;
