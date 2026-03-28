import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, '..');
const publicDir = path.join(projectRoot, 'public');
const contentDir = path.join(publicDir, 'content');

const requiredFiles = [
  path.join(publicDir, 'chapters.json'),
  path.join(publicDir, 'knowledge_graph.json'),
];

for (const filePath of requiredFiles) {
  const fileContents = await readFile(filePath, 'utf8');
  JSON.parse(fileContents);
}

const contentEntries = await readdir(contentDir, { withFileTypes: true });
const chapterFiles = contentEntries
  .filter((entry) => entry.isFile() && entry.name.startsWith('ch-') && entry.name.endsWith('.json'))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, 'en'));

for (const chapterFile of chapterFiles) {
  const chapterPath = path.join(contentDir, chapterFile);
  const chapterContents = await readFile(chapterPath, 'utf8');
  JSON.parse(chapterContents);
}

console.log(`Validated ${requiredFiles.length + chapterFiles.length} JSON files.`);
