// Script to export dictionary data to JSON format
// Useful for uploading to backend APIs or databases

import { dictionary } from '../src/data/dictionary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export to JSON file
const exportToJSON = () => {
  const outputPath = path.join(__dirname, '../dictionary-export.json');
  
  const jsonData = JSON.stringify(dictionary, null, 2);
  
  fs.writeFileSync(outputPath, jsonData, 'utf8');
  
  console.log(`✅ Dictionary exported successfully!`);
  console.log(`📁 Location: ${outputPath}`);
  console.log(`📊 Total entries: ${dictionary.length}`);
};

// Export to CSV file
const exportToCSV = () => {
  const outputPath = path.join(__dirname, '../dictionary-export.csv');
  
  // CSV headers
  const headers = ['geez', 'amharic', 'english', 'oromiffa', 'root', 'verbType', 'rootLetter'];
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  dictionary.forEach(verb => {
    const row = headers.map(header => {
      const value = verb[header] || '';
      // Escape commas and quotes in CSV
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvContent += row.join(',') + '\n';
  });
  
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  
  console.log(`✅ Dictionary exported to CSV successfully!`);
  console.log(`📁 Location: ${outputPath}`);
  console.log(`📊 Total entries: ${dictionary.length}`);
};

// Export statistics
const exportStats = () => {
  const stats = {
    totalEntries: dictionary.length,
    byRootLetter: {},
    byVerbType: {},
    languages: ['geez', 'amharic', 'english', 'oromiffa']
  };
  
  // Count by root letter
  dictionary.forEach(verb => {
    const rootLetter = verb.rootLetter || 'unknown';
    stats.byRootLetter[rootLetter] = (stats.byRootLetter[rootLetter] || 0) + 1;
  });
  
  // Count by verb type
  dictionary.forEach(verb => {
    const verbType = verb.verbType || 'unknown';
    stats.byVerbType[verbType] = (stats.byVerbType[verbType] || 0) + 1;
  });
  
  const outputPath = path.join(__dirname, '../dictionary-stats.json');
  fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2), 'utf8');
  
  console.log(`\n📊 Dictionary Statistics:`);
  console.log(`   Total entries: ${stats.totalEntries}`);
  console.log(`   Root letters: ${Object.keys(stats.byRootLetter).length}`);
  console.log(`   Verb types: ${Object.keys(stats.byVerbType).length}`);
  console.log(`\n📁 Stats saved to: ${outputPath}`);
};

// Run exports
console.log('🚀 Starting dictionary export...\n');

try {
  exportToJSON();
  exportToCSV();
  exportStats();
  
  console.log('\n✨ All exports completed successfully!');
} catch (error) {
  console.error('❌ Export failed:', error.message);
  process.exit(1);
}
