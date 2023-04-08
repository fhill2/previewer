import { URL } from 'url';
import path from 'path';
import fs from 'fs';

function resolveHtmlPath(htmlFileName) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}


function isTextFile(filepath) {
  const MAX_BYTES_TO_READ = 512; // read first 512 bytes only
  const buffer = Buffer.alloc(MAX_BYTES_TO_READ);
  let fd, bytesRead;
  
  try {
    fd = fs.openSync(filepath, 'r');
    bytesRead = fs.readSync(fd, buffer, 0, MAX_BYTES_TO_READ, 0);
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    if (fd) fs.closeSync(fd);
  }
  
  // check for null bytes or other non-text characters
  for (let i = 0; i < bytesRead; i++) {
    const byte = buffer[i];
    if (byte === 0 || byte === 9 || byte === 10 || byte === 13) {
      continue; // allow tabs, line feeds, carriage returns
    } else if (byte < 32 || byte > 126) {
      return false; // not a printable ASCII character
    }
  }
  
  return true; // no binary data found
}

export { resolveHtmlPath, isTextFile }
