// Script to analyze dictionary data for quality and completeness
import { dictionary } from '../src/data/dictionary.js';

console.log('🔍 Analyzing Geez-Amharic Dictionary...\n');

// 1. Basic Statistics
console.log('📊 BASIC STATISTICS');
console.log('='.repeat(50));
console.log(`Total verbs: ${dictionary.length}`);

// 2. Check for missing fields
console.log('\n🔍 CHECKING DATA COMPLETENESS');
console.log('='.repeat(50));

const missingGeez = dictionary.filter(v => !v.geez);
const missingAmharic = dictionary.filter(v => !v.amharic);
const missingEnglish = dictionary.filter(v => !v.english);
const missingOromiffa = dictionary.filter(v => !v.oromiffa);
const missingRoot = dictionary.filter(v => !v.root);
const missingVerbType = dictionary.filter(v => !v.verbType);
const missingRootLetter = dictionary.filter(v => !v.rootLetter);
const missingConjugation = dictionary.filter(v => !v.conjugation);

console.log(`Missing Geez: ${missingGeez.length}`);
console.log(`Missing Amharic: ${missingAmharic.length}`);
console.log(`Missing English: ${missingEnglish.length}`);
console.log(`Missing Oromiffa: ${missingOromiffa.length}`);
console.log(`Missing Root: ${missingRoot.length}`);
console.log(`Missing Verb Type: ${missingVerbType.length}`);
console.log(`Missing Root Letter: ${missingRootLetter.length}`);
console.log(`Missing Conjugation: ${missingConjugation.length}`);

// 3. Check for duplicates
console.log('\n🔍 CHECKING FOR DUPLICATES');
console.log('='.repeat(50));

const geezVerbs = dictionary.map(v => v.geez);
const duplicateGeez = geezVerbs.filter((v, i) => geezVerbs.indexOf(v) !== i);
const uniqueDuplicates = [...new Set(duplicateGeez)];

console.log(`Duplicate Geez verbs: ${uniqueDuplicates.length}`);
if (uniqueDuplicates.length > 0) {
  console.log('Duplicates found:');
  uniqueDuplicates.slice(0, 10).forEach(verb => {
    const count = geezVerbs.filter(v => v === verb).length;
    console.log(`  - ${verb} (appears ${count} times)`);
  });
  if (uniqueDuplicates.length > 10) {
    console.log(`  ... and ${uniqueDuplicates.length - 10} more`);
  }
}

// 4. Verb Type Distribution
console.log('\n📊 VERB TYPE DISTRIBUTION');
console.log('='.repeat(50));

const verbTypes = {};
dictionary.forEach(verb => {
  const type = verb.verbType || 'Unknown';
  verbTypes[type] = (verbTypes[type] || 0) + 1;
});

Object.entries(verbTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    const percentage = ((count / dictionary.length) * 100).toFixed(1);
    console.log(`${type}: ${count} (${percentage}%)`);
  });

// 5. Root Letter Distribution
console.log('\n📊 ROOT LETTER DISTRIBUTION');
console.log('='.repeat(50));

const rootLetters = {};
dictionary.forEach(verb => {
  const letter = verb.rootLetter || 'Unknown';
  rootLetters[letter] = (rootLetters[letter] || 0) + 1;
});

Object.entries(rootLetters)
  .sort((a, b) => b[1] - a[1])
  .forEach(([letter, count]) => {
    const percentage = ((count / dictionary.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(count / 10));
    console.log(`${letter}: ${count.toString().padStart(4)} (${percentage.padStart(5)}%) ${bar}`);
  });

// 6. Check conjugation completeness
console.log('\n🔍 CONJUGATION ANALYSIS');
console.log('='.repeat(50));

const withConjugation = dictionary.filter(v => v.conjugation);
const missingPast = withConjugation.filter(v => !v.conjugation.past);
const missingPresent = withConjugation.filter(v => !v.conjugation.present);
const missingFuture = withConjugation.filter(v => !v.conjugation.future);

console.log(`Verbs with conjugation: ${withConjugation.length}`);
console.log(`Missing past tense: ${missingPast.length}`);
console.log(`Missing present tense: ${missingPresent.length}`);
console.log(`Missing future tense: ${missingFuture.length}`);

// 7. Language coverage
console.log('\n🌍 LANGUAGE COVERAGE');
console.log('='.repeat(50));

const allLanguages = dictionary.filter(v => v.geez && v.amharic && v.english && v.oromiffa);
const threeLanguages = dictionary.filter(v => 
  [v.geez, v.amharic, v.english, v.oromiffa].filter(Boolean).length === 3
);
const twoLanguages = dictionary.filter(v => 
  [v.geez, v.amharic, v.english, v.oromiffa].filter(Boolean).length === 2
);

console.log(`All 4 languages: ${allLanguages.length} (${((allLanguages.length / dictionary.length) * 100).toFixed(1)}%)`);
console.log(`3 languages: ${threeLanguages.length} (${((threeLanguages.length / dictionary.length) * 100).toFixed(1)}%)`);
console.log(`2 languages: ${twoLanguages.length} (${((twoLanguages.length / dictionary.length) * 100).toFixed(1)}%)`);

// 8. Sample entries
console.log('\n📝 SAMPLE ENTRIES');
console.log('='.repeat(50));

const samples = [0, Math.floor(dictionary.length / 4), Math.floor(dictionary.length / 2), dictionary.length - 1];
samples.forEach(index => {
  const verb = dictionary[index];
  console.log(`\n[${index + 1}] ${verb.geez}`);
  console.log(`  Amharic: ${verb.amharic}`);
  console.log(`  English: ${verb.english}`);
  console.log(`  Type: ${verb.verbType}`);
  console.log(`  Root Letter: ${verb.rootLetter}`);
});

// 9. Quality Score
console.log('\n⭐ QUALITY SCORE');
console.log('='.repeat(50));

const completenessScore = (allLanguages.length / dictionary.length) * 100;
const conjugationScore = (withConjugation.length / dictionary.length) * 100;
const duplicateScore = 100 - ((uniqueDuplicates.length / dictionary.length) * 100);
const overallScore = (completenessScore + conjugationScore + duplicateScore) / 3;

console.log(`Completeness: ${completenessScore.toFixed(1)}%`);
console.log(`Conjugation: ${conjugationScore.toFixed(1)}%`);
console.log(`Uniqueness: ${duplicateScore.toFixed(1)}%`);
console.log(`\n🎯 Overall Quality Score: ${overallScore.toFixed(1)}%`);

if (overallScore >= 90) {
  console.log('✅ Excellent! Dictionary is production-ready.');
} else if (overallScore >= 75) {
  console.log('✅ Good! Minor improvements recommended.');
} else if (overallScore >= 60) {
  console.log('⚠️  Fair. Some improvements needed.');
} else {
  console.log('❌ Needs significant improvement.');
}

// 10. Recommendations
console.log('\n💡 RECOMMENDATIONS');
console.log('='.repeat(50));

const recommendations = [];

if (uniqueDuplicates.length > 0) {
  recommendations.push(`Remove ${uniqueDuplicates.length} duplicate entries`);
}

if (missingAmharic.length > 0) {
  recommendations.push(`Add Amharic translations for ${missingAmharic.length} verbs`);
}

if (missingEnglish.length > 0) {
  recommendations.push(`Add English translations for ${missingEnglish.length} verbs`);
}

if (missingOromiffa.length > 0) {
  recommendations.push(`Add Oromiffa translations for ${missingOromiffa.length} verbs`);
}

if (missingConjugation.length > 0) {
  recommendations.push(`Add conjugations for ${missingConjugation.length} verbs`);
}

const underrepresented = Object.entries(rootLetters)
  .filter(([letter, count]) => count < 10 && letter !== 'Unknown')
  .map(([letter]) => letter);

if (underrepresented.length > 0) {
  recommendations.push(`Add more verbs for root letters: ${underrepresented.join(', ')}`);
}

if (recommendations.length === 0) {
  console.log('✅ No major issues found! Dictionary is in excellent shape.');
} else {
  recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });
}

console.log('\n' + '='.repeat(50));
console.log('✨ Analysis complete!\n');
