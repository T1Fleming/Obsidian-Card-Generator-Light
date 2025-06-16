/**
 * @file processMd.js
 * @description This file is responsible for processing Markdown (.md) files and converting their structure into a hierarchical JSON format. 
 *              It uses a tab-based or 4-space indentation system to determine parent-child relationships between lines of text.
 *              The resulting structure is stored in a tree-like format, starting from a root document object.
 * 
 *              The script includes functionality to:
 *              - Read a Markdown file (`sample.md`) asynchronously.
 *              - Parse the file line by line, identifying indentation levels to build a nested structure.
 *              - Handle empty lines and reset the hierarchy appropriately.
 *              - Generate unique IDs for each node in the structure using the `ulid` library.
 *              - Log the processing steps for debugging purposes.
 * 
 *              Future improvements include handling code blocks and preserving newlines for accurate Markdown recreation.
 * 
 * @module processMd
 * @requires fs - Node.js file system module (promises API) for reading files.
 * @requires fake-indexeddb/auto - A mock IndexedDB implementation for testing.
 * @requires idb - A library for working with IndexedDB.
 * @requires ulid - A library for generating unique IDs.
 */


import { promises as fs } from 'fs';
import "fake-indexeddb/auto";
import { openDB } from "idb";
import { ulid } from 'ulid';



export const DOCUMENT_ROOT = {
    "text": ["hello world"],
    "_id": `r-${ulid()}`,
    "children": [],
    "parent": null,
    "cardInfo": [],
    "srs": {
        "due": null,
        "interval": null
    }
}

const formatEmText = (text) => {
    return {

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
        let tabParents = [DOCUMENT_ROOT]

        for (let i = 0; i < lines.length; i++) {
            const currentLine = lines[i];

            console.log('Line is:', currentLine);

            // Skip empty lines
            if (currentLine.trim() === '') {
                tabParents = [DOCUMENT_ROOT]

                //TODO: Here I can actually capture the newlines and add it to the last parent's text array. (NOT the root). 
                // That way, I can playback the newlines if i were to ever recreate the markdown.
                continue;
            }


            console.log('Current State:', `${JSON.stringify(tabParents, null, 2)}`);


            //TODO: "Tab Mode" works great, but I need to eventually add support for code blocks. 
            // These use tabs which can be an issue

            // Check if currentLine begins with one or more tabs or 4-space groups
            const tabMatch = currentLine.match(/^(?:\t| {4})+/);
            if (tabMatch) {
                // Count each individual tab or 4-space group.
                const units = tabMatch[0].match(/(\t| {4})/g);
                const numUnits = units ? units.length : 0;
                console.log('Number of tab/4-space units at start:', numUnits);
                // console.log(JSON.stringify(tabParents, null, 2));

                tabParents[numUnits + 1] = { "text": "", "_id": "" };
                tabParents[numUnits + 1].text = currentLine;
                tabParents[numUnits + 1]._id = `r-${ulid()}`;

                if (numUnits + 1 > 0 && tabParents[numUnits]) {
                    // Add the current line to the tabParents array
                    console.log('the single parent is:', tabParents[numUnits]);
                } else {
                    console.log('No parent found for this line. Possible incorrect indentation.');
                    if (tabParents[tabParents.length - 1]) {

                        console.log('set the single parent to the last available:', tabParents[tabParents.length - 1]);
                    } else {
                        // This condition probably is not possible
                        throw new Error('No parent found and no root parent available.');
                    }
                }
            } else {
                console.log('Number of tab/4-space units at start: 0. Parent is still root!');
                tabParents = [DOCUMENT_ROOT, { "text": currentLine, "_id": `r-${ulid()}` }]; // Reset tabParents if no tabs or spaces
            }
        }
    } catch (error) {
        console.error('Error processing file:', error);
    }
}