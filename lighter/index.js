const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function waitForUserInput(message, callback) {
    rl.question(message, (input) => {
        if (input.toLowerCase() === 'y') {
            callback();
        } else {
            console.log('Please type "y" to continue.');
            waitForUserInput(message, callback);
        }
    });
}

console.log('Step 1: Starting process...');
waitForUserInput('Type "y" to proceed to Step 2: ', () => {
    console.log('Step 2: Process continued...');
    waitForUserInput('Type "y" to proceed to Step 3: ', () => {
        console.log('Step 3: Process completed!');
        rl.close();
    });
});