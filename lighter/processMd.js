import { promises as fs } from 'fs';

async function processOutputMd() {
    try {
        // Read the contents of output.md
        const data = await fs.readFile('output.md', 'utf8');
        // Split file into an array of lines and filter out all empty lines.
        const filteredLines = data.split(/\r?\n/).filter(line => line.trim() !== '');

        const groups = [];
        let currentGroup = '';

        for (const line of filteredLines) {
            console.log(line);

            //   // Check if the line is indented (using tab or 4+ spaces)
            //   if (/^(\t| {4,})/.test(line)) {
            //     // Append this line (trimmed) to the current group, if it exists.
            //     if (currentGroup !== '') {
            //       currentGroup += ' ' + line.trim();
            //     } else {
            //       currentGroup = line.trim();
            //     }
            //   } else {
            //     // A non-indented line starts a new group.
            //     // Flush the previous group if it exists.
            //     if (currentGroup !== '') {
            //       groups.push(currentGroup);
            //     }
            //     currentGroup = line.trim();
            //   }
            // }

            // // Add any leftover group.
            // if (currentGroup !== '') {
            //   groups.push(currentGroup);
            }

            // // Log all groups in a single console.log call, with each group on its own line.
            // console.log(groups.join('\n') + "🌽");
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }

processOutputMd().then(() => {
        console.log('processOutputMd finished');
    }).catch((error) => {
        console.error('Error in processOutputMd:', error);
    });