const fs = require('fs');
const fsP = require('fs/promises');

function __checkIfDatabaseExists() {
    let __folders = fs.readdirSync('./'); // get list of all files and folders
    let __dbDirectory = __folders.find(_folder => _folder.startsWith('Db-')); // check if any starts with 'Db-'

    if (__dbDirectory !== undefined) {
        let __dbDirectoryPath = fs.statSync(process.cwd() + '/' + __dbDirectory); // get stats of the file/folder
        if (__dbDirectoryPath.isDirectory()) { // it should be a directory
            return __dbDirectory; // return folder name if it exists
        } else {
            return null; // return null if it is not a directory
        }
    }
};


function __rGroupIsAuthentic(dbDir, rGroup) {
    // in relational groups, all elements should have the same keys
    // check if all elements have the same keys
    let __files = fs.readdirSync('./' + dbDir + '/' + rGroup); // get list of all files
    __files = __files.filter(_file => _file !== '__config.json'); // remove config file
    // check if all files have the same keys
    let __keys = []; // this array will contains arrays of keys of all elements
    __files.forEach(__file => {
        __keys.push(Object.keys(JSON.parse(fs.readFileSync('./' + dbDir + '/' + rGroup + '/' + __file)))); // get keys of each element
    });

    // check if all keys are the same
    let __keysAreSame = true;;
    for (let i = 0; i < __keys.length; i++) { // iterate through all key arrays
        if (JSON.stringify(__keys[i]) !== JSON.stringify(__keys[0])) {
            __keysAreSame = false;
            break;
        }
    }
    return __keysAreSame;
}

async function __exists(path) { // check if file exists
    try {
        await fsP.access(path); // this would raise error if the path does not exist
        return true;
    } catch (err) {
        return false;
    }
}

// get entry from a relational group by its moral
function __getEntry(dbDir, group, element, moral) {
    let elementObj = JSON.parse(fs.readFileSync('./' + dbDir + '/' + group + '/' + element + '.json'))
    // check if moral is in the element
    let entries = Object.keys(elementObj) // get all entries in the element
    let requiredEntry = null // this will be the required entry if it exists
    entries.forEach(entry => {
        if (elementObj[entry] === moral) { // if the moral is in the entry
            requiredEntry = entry // set the required entry
        }
    })

    return requiredEntry
}

function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m');
}

module.exports = { __checkIfDatabaseExists, __rGroupIsAuthentic, __exists, greenConsole, __getEntry };