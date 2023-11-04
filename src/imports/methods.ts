import fs from "fs";
import fsP from "fs/promises";
import { __decryptMsg } from './encryption.js';

function __checkIfDatabaseExists() {
    let __folders = fs.readdirSync('./'); // get list of all files and folders
    let __dbDirectory = __folders.find(_folder => _folder.startsWith('Db-')); // check if any starts with 'Db-'

    if (__dbDirectory) {
        let __dbDirectoryPath = fs.statSync(process.cwd() + '/' + __dbDirectory); // get stats of the file/folder
        if (__dbDirectoryPath.isDirectory())  // it should be a directory
            return __dbDirectory; // return folder name if it exists
    }
};


async function __rGroupIsAuthentic(dbDir: string, rGroup: string) {
    // in relational groups, all elements should have the same keys
    // check if all elements have the same keys
    let __files = await fsP.readdir('./' + dbDir + '/' + rGroup); // get list of all files
    __files = __files.filter(_file => _file !== '__config.json'); // remove config file
    // check if all files have the same keys
    let __keys: string[] = []; // this array will contains arrays of keys of all elements
    __files.forEach(async __file => {
        let __fileObj = JSON.parse(
            await fsP.readFile('./' + dbDir + '/' + rGroup + '/' + __file) as unknown as string
        );
        let __fileKeys = Object.keys(__fileObj); // get all keys of the element
        __keys.concat(__fileKeys); // add the keys to the array
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
};

async function __exists(path: string) { // check if file exists
    try {
        await fsP.access(path); // this would raise error if the path does not exist
        return true;
    } catch (err) {
        return false;
    }
};

// get entry from a relational group by its moral
function __getEntry(dbDir: string, group: string, element: string, moral: string) {
    let elementObj = JSON.parse(
        fs.readFileSync('./' + dbDir + '/' + group + '/' + element + '.json') as unknown as string
    );

    // check if moral is in the element
    let entries = Object.keys(elementObj) // get all entries in the element
    let requiredEntry: string | undefined; // this will be the required entry if it exists
    entries.forEach(entry => {
        if (__decryptMsg(elementObj[entry]) === moral) { // if the moral is in the entry
            requiredEntry = entry // set the required entry
        }
    })

    return requiredEntry;
};

function greenConsole(text: string) {
    console.log('\x1b[32m' + text + '\x1b[0m');
};

function yellowConsole(text: string) {
    console.log('\x1b[33m' + text + '\x1b[0m');
};

function redConsole(text: string) {
    console.error(`\x1b[31m[Err]: ${text}\x1b[0m`);
}

export {
    __checkIfDatabaseExists,
    __rGroupIsAuthentic,
    __exists,
    greenConsole,
    yellowConsole,
    redConsole,
    __getEntry,
};