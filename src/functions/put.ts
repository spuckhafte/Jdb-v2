const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
};

import {
    __checkIfDatabaseExists,
    __rGroupIsAuthentic,
    greenConsole,
    yellowConsole,
    __exists,
    redConsole
} from "../imports/methods.js";
import { __encryptMsg } from "../imports/encryption.js";
import fs from "fs/promises";


// assign to rGroup
async function assignR(group: string, moralQuery: { [index: string]: any }) {  // moralQuery: { Element: Moral }
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (!dbDirectory) {
        redConsole("No database found");
        return -1;
    }
    // check if group exists
    let checkGroupPath = './' + dbDirectory + '/' + group;
    if (!(await __exists(checkGroupPath))) {
        redConsole("Group does not exists");
        return -1;
    }

    // check if group is relational group
    let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
    let groupConfig: string = JSON.parse(
        await fs.readFile(checkGroupConfigPath) as unknown as string
    )["type"]; // check the type of group

    if (groupConfig !== 'rGroup') {
        redConsole("Group is not relational");
        return -1;
    }
    // check if group is authentic
    if (!(await __rGroupIsAuthentic(dbDirectory, group))) {
        redConsole("rGroup is not authentic");
        return -1;
    }

    if (typeof moralQuery !== 'object') {
        redConsole("Moral query provided is invalid, not an object");
        return -1;
    }
    let allElementsOfGroup = await fs.readdir(checkGroupPath);
    // remove the config file from the list
    allElementsOfGroup.splice(allElementsOfGroup.indexOf('__config.json'), 1);

    let elementsOfMoral = Object.keys(moralQuery); // elements in which the morals are to be assigned
    elementsOfMoral.forEach((element, index) => {
        elementsOfMoral[index] = element + '.json'; // add .json to the elemenxt names
    })

    // check if all elements of morals are present in all elements of group
    // elements of moral => element1.json, element2.json, ... (provided by user)
    // all elements of group => element1.json, element2.json, ... (present in the group, the directory)
    if (allElementsOfGroup.every(element => elementsOfMoral.includes(element))) {
        // find the length of array of the keys of first element in group
        let firstElement = JSON.parse(
            await fs.readFile(
                checkGroupPath + '/' + allElementsOfGroup[0]
            ) as unknown as string
        );
        let lengthOfFirstElement = Object.keys(firstElement).length; // this value is the entry of new morals in all elements of group

        // put the morals in respective elements at the required entries
        elementsOfMoral.forEach(async key => { // key = element
            let elementPath = './' + dbDirectory + '/' + group + '/' + key; // path of element to be updated
            let elementFile = await fs.readFile(elementPath); // read the file

            let element = JSON.parse(elementFile as unknown as string); // element to be updated

            key = key.slice(0, -5); // remove .json from element's name
            element[lengthOfFirstElement] = __encryptMsg(moralQuery[key]); // put value of moralObject to element with encryption

            await fs.writeFile(elementPath, JSON.stringify(element, null, 4)); // write the updated element to file
        });

        greenConsole('R-Moral assigned successfully');
        return lengthOfFirstElement; // return the entry of the assigned morals
    } else {
        // if the elementsOfMoral does not include all elements of group, we will get the missing elements and assign them to null in moralObject
        yellowConsole("[Warning] All elements in the group were not found");
        let remainingEntries = allElementsOfGroup.filter(element => !elementsOfMoral.includes(element) && allElementsOfGroup.includes(element));

        if (remainingEntries.length == 0) {
            redConsole("Morals of unkown entries");
            return - 1;
        }

        remainingEntries.forEach(element => {
            elementsOfMoral.push(element);
            // remove the .json from the element name
            element = element.slice(0, -5);
            moralQuery[element] = __encryptMsg("null");
        });

        let firstElement = JSON.parse(
            await fs.readFile(
                checkGroupPath + '/' + allElementsOfGroup[0]
            ) as unknown as string
        );
        let lengthOfFirstElement = Object.keys(firstElement).length; // this value is the entry of new morals in all elements of group

        // put the morals in respective elements at the required entries
        elementsOfMoral.forEach(async key => { // key = element's name
            let elementPath = './' + dbDirectory + '/' + group + '/' + key; // path of element to be updated
            let elementFile = await fs.readFile(elementPath); // read the file

            let element = JSON.parse(elementFile as unknown as string); // element to be updated

            key = key.slice(0, -5);
            element[lengthOfFirstElement] = __encryptMsg(moralQuery[key]); // put value of moralObject to element with encryption

            await fs.writeFile(elementPath, JSON.stringify(element, null, 4)); // write the updated element to file
        });

        greenConsole('R-Morals assigned successfully')
        return lengthOfFirstElement; // return the entry of the assigned morals
    }
};


// assign to iGroup
async function assignI(group: string, element: string, primeQuery: { [index: string]: any }) { // primeObject {prime: value} -> simple
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (!dbDirectory) {
        redConsole("No database found");
        return false;
    }
    // check if group exists
    let checkGroupPath = './' + dbDirectory + '/' + group;
    if (!(await __exists(checkGroupPath))) {
        redConsole("Group does not exists");
        return false;
    }
    // check if group is individual group
    let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
    let groupConfig = JSON.parse(
        await fs.readFile(checkGroupConfigPath) as unknown as string
    )["type"]; // check the type of group

    if (groupConfig !== 'iGroup') {
        redConsole("Group is not an [iGroup] (individual group)");
        return false;
    }
    // iGroups can't be authentic so we don't need to check it
    if (typeof primeQuery !== 'object') {
        redConsole("primeQuery is invalid, not an object :: (for an element) { prime: value }");
        return false;
    }
    let elementPath = './' + dbDirectory + '/' + group + '/' + element + '.json'; // get the element path
    if (!(await __exists(elementPath))) {
        redConsole("Element does not exists");
        return false;
    }
    let elementFile = await fs.readFile(elementPath); // read the element file

    let elementData = JSON.parse(elementFile as unknown as string); // element to be updated

    let encryptedPrimeObject: { [index: string]: any } = {}; // new object to be updated
    Object.keys(primeQuery).forEach(key => {
        encryptedPrimeObject[key] = __encryptMsg(primeQuery[key]); // encrypt the primeObject
    });

    let newElement = Object.assign(elementData, encryptedPrimeObject); // combine the element and the primeObject

    await fs.writeFile(elementPath, JSON.stringify(newElement, null, 4)); // write the new element to file

    greenConsole('I-Moral assigned successfully');
    return true
};

export { assignR, assignI };
