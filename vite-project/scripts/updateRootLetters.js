// Script to update rootLetter to be the last letter of each Geez verb
import { dictionary } from '../src/data/dictionary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Updating rootLetter for all verbs...\n');

let updated = 0;
let unchanged = 0;

dictionary.forEach(verb => {
  if (verb.geez) {
    const lastLetter = verb.geez.charAt(verb.geez.length - 1);
    if (verb.rootLetter !== lastLetter) {
      verb.rootLetter = lastLetter;
      updated++;
    } else {
      unchanged++;
    }
  }
});

// Write the updated dictionary back to file
const outputPath = path.join(__dirname, '../src/data/dictionary.js');
const fileContent = `export const dictionary = ${JSON.stringify(dictionary, null, 2)};

// Add conjugation patterns to all verbs
dictionary.forEach(verb => {
  if (!verb.conjugation) {
    verb.conjugation = {
      past: verb.amharic,
      present: \`ይ\${verb.amharic}ል\`,
      future: \`ይ\${verb.amharic}ል ይሆናል\`
    };
  }
});
`;

fs.writeFileSync(outputPath, fileContent, 'utf8');

console.log(`✅ Update complete!`);
console.log(`   Updated: ${updated} verbs`);
console.log(`   Unchanged: ${unchanged} verbs`);
console.log(`   Total: ${dictionary.length} verbs\n`);

// Show some examples
console.log('📝 Sample updates:');
const samples = [0, 100, 500, 1000, Math.min(1176, dictionary.length - 1)];
samples.forEach(i => {
  const verb = dictionary[i];
  if (verb) {
    console.log(`   ${verb.geez} -> rootLetter: "${verb.rootLetter}"`);
  }
});
