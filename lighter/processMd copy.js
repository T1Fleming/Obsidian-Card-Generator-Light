import { promises as fs } from 'fs';

async function processOutputMd() {
    try {
        const data = await fs.readFile('sample.md', 'utf8');

        // Split file into an array of lines
        const lines = data.split(/\r?\n/);
        let tabParents = []


        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i];

            // Skip empty lines
            if (currentLine.trim() === '') {
                tabParents = []
                continue;
            }

            // Set the parent
            tabParents[0] = currentLine;

            console.log('Current:', `->${currentLine}`);

            // Check if currentLine begins with one or more tabs or 4-space groups
            const tabMatch = currentLine.match(/^(?:\t| {4})+/);
            if (tabMatch) {
                // Count each individual tab or 4-space group.
                const units = tabMatch[0].match(/(\t| {4})/g);
                const numUnits = units ? units.length : 0;
                console.log('Number of tab/4-space units at start:', numUnits);

                tabParents[numUnits] = currentLine;
                if (numUnits > 0 && tabParents[numUnits - 1]) {
                    // Add the current line to the tabParents array
                    console.log('the single parent is:', tabParents[numUnits - 1]);
                } else {
                    console.log('No parent found for this line. Possible incorrect indentation.');
                    if (tabParents[0]) {

                        console.log('the single parent is:', tabParents[0]);
                    } else {
                        // This condition probably is not possible
                        throw new Error('No parent found and no root parent available.');
                    }
                }
            } else {
                console.log('Number of tab/4-space units at start: 0');
                tabParents = []; // Reset tabParents if no tabs or spaces
            }
        }
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

processOutputMd().then(() => {
    console.log('processOutputMd finished');
}).catch((error) => {
    console.error('Error in processOutputMd:', error);
});