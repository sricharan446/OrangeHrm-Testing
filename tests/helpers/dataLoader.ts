import fs from 'fs';
import path from 'path';

export function loadJSON(file: string): any {
  const filePath = path.join(__dirname, '..', 'data', file);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}
