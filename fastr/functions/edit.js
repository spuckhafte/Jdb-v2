// entry, moralObject => 0, {users(el): rakshit, pass(el): pass}
const fs = require('fs/promises');
const { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, __exists } = require('./import/funcs');
const { __encryptMsg } = require('./import/encryption');

async function editR(group, entry, moralObject) {
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (dbDirectory !== null) {
        // check if group exists
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (await __exists(checkGroupPath)) {
            // check if group is relational group
            let checkGroupConfigPath = process.cwd() + '/' + dbDirectory + '/' + group + '/__config.json';
            let groupConfig = require(checkGroupConfigPath)["type"]; // check the type of group
            if (groupConfig == "rGroup") {
                // check if group is authentic
                if (await __rGroupIsAuthentic(dbDirectory, group)) {
                    if (typeof moralObject == "object") {
                        let allElementsOfGroup = await fs.readdir(checkGroupPath); // all elements of group
                        let elementsProvided = Object.keys(moralObject) // all elements provided
                        elementsProvided.forEach((_el, _ind) => elementsProvided[_ind] = _el + ".json"); // add .json to the elements provided
                        // check if elementsProvided is a subset of allElementsOfGroup
                        if (elementsProvided.every(_el => allElementsOfGroup.includes(_el))) {
                            elementsProvided.forEach(async element => {
                                let elementPath = process.cwd() + '/' + dbDirectory + '/' + group + '/' + element; // path of element to be updated
                                let elementObj = require(elementPath); // read the file
                                elementObj[entry] = __encryptMsg(moralObject[element.slice(0, -5)]); // put value of moralObject to element with encryption
                                await fs.writeFile(elementPath, JSON.stringify(elementObj, null, 4)); // write the file
                            })
                            greenConsole("Element/s updated successfully");

                        } else console.error('\x1b[31m[Err]:\x1b[0m Either one of the elements does not exist in the group');
                    } else console.error('\x1b[31m[Err]:\x1b[0m MoralObject is not an object');
                } else console.error('\x1b[31m[Err]:\x1b[0m Group is not authentic');
            } else console.error('\x1b[31m[Err]:\x1b[0m Group is not relational');
        } else console.error('\x1b[31m[Err]:\x1b[0m Group does not exist');
    } else console.error('\x1b[31m[Err]:\x1b[0m Database does not exist');
}

module.exports = { editR };