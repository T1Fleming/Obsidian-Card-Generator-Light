import { promises as fs } from 'fs';
import "fake-indexeddb/auto";
import { openDB } from "idb";
import { ulid } from 'ulid';

export const DOCUMENT_ROOT = {
    "text": [],
    "_id": `r-${ulid()}`,
    "children": [],
    "parent": null,
    "cardInfo": [],
    "srs":{
        "due": null,
        "interval": null
    }
}

const formatEmText = (text) => {
    return{

    }
}

// function formDatabaseJson() {
//     return {
//         "text": [{
//             "type": null,
//             "content": null
//         }],
//         "_id": null,
//         "children": [],
//         "parent": null,
//         "cardInfo": [{
//             "kind": "Basic",
//             "front": 0,
//             "back": 0
//         }]
//     }
// }

export async function processOutputMd() {
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
            tabParents[0] = { "text": currentLine, "_id": `r-${ulid()}` };

            console.log('Current:', `${tabParents[0]}`);

            // Check if currentLine begins with one or more tabs or 4-space groups
            const tabMatch = currentLine.match(/^(?:\t| {4})+/);
            if (tabMatch) {
                // Count each individual tab or 4-space group.
                const units = tabMatch[0].match(/(\t| {4})/g);
                const numUnits = units ? units.length : 0;
                console.log('Number of tab/4-space units at start:', numUnits);

                tabParents[numUnits] = { "text": "", "_id": "" };
                tabParents[numUnits].text = currentLine;
                tabParents[numUnits]._id = `r-${ulid()}`;

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