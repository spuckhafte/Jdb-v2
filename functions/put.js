const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
};

const { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, yellowConsole, __exists } = require('./import/funcs');
const { __encryptMsg } = require('./import/encryption');
const fs = require('fs/promises');


// assign to rGroup
async function assignR(group, moralObject) {  // moralObject = {users(el): rakshit, pass(el): pass} -> for the latest entry
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (dbDirectory !== null) {
        // check if group exists
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (await __exists(checkGroupPath)) {

            // check if group is relational group
            let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
            let groupConfig = JSON.parse(await fs.readFile(checkGroupConfigPath))["type"]; // check the type of group

            if (groupConfig == 'rGroup') {
                // check if group is authentic
                if (await __rGroupIsAuthentic(dbDirectory, group)) {
                    if (typeof moralObject == 'object') {
                        let allElementsOfGroup = await fs.readdir(checkGroupPath);
                        // remove the config file from the list
                        allElementsOfGroup.splice(allElementsOfGroup.indexOf('__config.json'), 1);

                        let elementsOfMoral = Object.keys(moralObject); // elements in which the morals are to be assigned
                        elementsOfMoral.forEach((element, index) => {
                            elementsOfMoral[index] = element + '.json'; // add .json to the element names
                        })

                        // check if all elements of morals are present in all elements of group
                        // elements of moral => element1.json, element2.json, ... (provided by user)
                        // all elements of group => element1.json, element2.json, ... (present in the group, the directory)
                        if (allElementsOfGroup.every(element => elementsOfMoral.includes(element))) {
                            // find the length of array of the keys of first element in group
                            let firstElement = JSON.parse(await fs.readFile(checkGroupPath + '/' + allElementsOfGroup[0]));
                            let lengthOfFirstElement = Object.keys(firstElement).length; // this value is the entry of new morals in all elements of group

                            // put the morals in respective elements at the required entries
                            elementsOfMoral.forEach(async key => { // key = element
                                let elementPath = './' + dbDirectory + '/' + group + '/' + key; // path of element to be updated
                                let elementFile = await fs.readFile(elementPath); // read the file

                                let element = JSON.parse(elementFile); // element to be updated

                                key = key.slice(0, -5); // remove .json from element's name
                                element[lengthOfFirstElement] = __encryptMsg(moralObject[key]); // put value of moralObject to element with encryption

                                await fs.writeFile(elementPath, JSON.stringify(element, null, 4)); // write the updated element to file
                            })
                            greenConsole('R-Moral assigned successfully');
                            return lengthOfFirstElement; // return the entry of the assigned morals
                        } else {
                            // if the elementsOfMoral does not include all elements of group, we will get the missing elements and assign them to null in moralObject
                            yellowConsole("[Warning] All elements in the group were not found");
                            let remainingEntries = allElementsOfGroup.filter(element => !elementsOfMoral.includes(element) && allElementsOfGroup.includes(element));
                            if (remainingEntries.length !== 0) {
                                remainingEntries.forEach(element => {
                                    elementsOfMoral.push(element);
                                    // remove the .json from the element name
                                    element = element.slice(0, -5);
                                    moralObject[element] = __encryptMsg("null");
                                });

                                let firstElement = JSON.parse(await fs.readFile(checkGroupPath + '/' + allElementsOfGroup[0]));
                                let lengthOfFirstElement = Object.keys(firstElement).length; // this value is the entry of new morals in all elements of group

                                // put the morals in respective elements at the required entries
                                elementsOfMoral.forEach(async key => { // key = element's name
                                    let elementPath = './' + dbDirectory + '/' + group + '/' + key; // path of element to be updated
                                    let elementFile = await fs.readFile(elementPath); // read the file

                                    let element = JSON.parse(elementFile); // element to be updated

                                    key = key.slice(0, -5);
                                    element[lengthOfFirstElement] = __encryptMsg(moralObject[key]); // put value of moralObject to element with encryption

                                    await fs.writeFile(elementPath, JSON.stringify(element, null, 4)); // write the updated element to file
                                })
                                greenConsole('R-Morals assigned successfully')
                                return lengthOfFirstElement; // return the entry of the assigned morals
                            } else console.error('\x1b[31m[Err]:\x1b[0m Morals of unkown entries');
                        }
                    } else console.error('\x1b[31m[Err]:\x1b[0m Moral is not an object');
                } else console.error('\x1b[31m[Err]:\x1b[0m Group is not authentic');
            } else console.error('\x1b[31m[Err]:\x1b[0m Group is not a relational group');
        } else console.error('\x1b[31m[Err]:\x1b[0m Group does not exist');
    } else console.error('\x1b[31m[Err]:\x1b[0m No database found');
};


// assign to iGroup
async function assignI(group, element, primeObject) { // primeObject {prime: value} -> simple
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (dbDirectory !== null) {
        // check if group exists
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (await __exists(checkGroupPath)) {
            // check if group is individual group
            let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
            let groupConfig = JSON.parse(await fs.readFile(checkGroupConfigPath))["type"]; // check the type of group
            if (groupConfig == 'iGroup') {
                // iGroups can't be authentic so we don't need to check it
                if (typeof primeObject == 'object') {
                    let elementPath = './' + dbDirectory + '/' + group + '/' + element + '.json'; // get the element path
                    if (await __exists(elementPath)) {
                        let elementFile = await fs.readFile(elementPath); // read the element file

                        let element = JSON.parse(elementFile); // element to be updated

                        let encryptedPrimeObject = {}; // new object to be updated
                        Object.keys(primeObject).forEach(key => {
                            encryptedPrimeObject[key] = __encryptMsg(primeObject[key]); // encrypt the primeObject
                        });

                        let newElement = Object.assign(element, encryptedPrimeObject); // combine the element and the primeObject

                        await fs.writeFile(elementPath, JSON.stringify(newElement, null, 4)); // write the new element to file
                        greenConsole('I-Moral assigned successfully');
                    } else console.error('\x1b[31m[Err]:\x1b[0m Element does not exist');
                } else console.error('\x1b[31m[Err]:\x1b[0m Invalid format => {prime: value}');
            } else console.error('\x1b[31m[Err]:\x1b[0m Group is not an individual group');
        } else console.error('\x1b[31m[Err]:\x1b[0m Group does not exist');
    } else console.error('\x1b[31m[Err]:\x1b[0m No database found');
};

module.exports = { assignR, assignI };
