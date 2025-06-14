import { promises as fs } from 'fs';

async function removeEmptyLines() {
  try {
    // Read the contents of sample.md
    const data = await fs.readFile('sample.md', 'utf8');

    // Split the file into lines, filter out empty lines, and join back together
    const filteredData = data
      .split(/\r?\n/)
      .filter(line => line.trim() !== '')
      .join('\n');

    // Write the processed text to output.md
    await fs.writeFile('output.md', filteredData);

    console.log('Empty lines removed and output.md created.');
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

removeEmptyLines().then(() => {
    console.log('removeEmptyLines finished');
  });