import fs from "fs/promises";
import {
    __checkIfDatabaseExists,
    __rGroupIsAuthentic,
    greenConsole,
    __exists,
    redConsole
} from "../imports/methods.js";
import { __encryptMsg } from '../imports/encryption.js';

async function editR(group: string, entry: string, moral: { [index: string]: any }) {
    let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
    if (!dbDirectory) {
        redConsole("Database does not exists");
        return false;
    }
    // check if group exists
    let checkGroupPath = './' + dbDirectory + '/' + group;
    if (!(await __exists(checkGroupPath))) {
        redConsole("Group does not exists");
        return false;
    }

    let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
    let groupConfig: "rGroup" | "iGroup" = JSON.parse(
        (await fs.readFile(checkGroupConfigPath)) as unknown as string
    )["type"];

    if (groupConfig !== "rGroup") {
        redConsole("Group is not relational");
        return false;
    }

    if (!(await __rGroupIsAuthentic(dbDirectory, group))) {
        redConsole("rGroup is not authentic");
        return false;
    }

    if (typeof moral !== "object") {
        redConsole("Invalid moral (should be an object)");
        return false;
    }


    let allElementsOfGroup = await fs.readdir(checkGroupPath); // all elements of group
    let elementsProvided = Object.keys(moral); // all elements provided
    elementsProvided.forEach((_el, _ind) => elementsProvided[_ind] = _el + ".json"); // add .json to the elements provided

    // check if elementsProvided is a subset of allElementsOfGroup
    if (!elementsProvided.every(_el => allElementsOfGroup.includes(_el))) {
        redConsole("Either one of the elements does not exists in the group");
        return false;
    }

    for (let element of elementsProvided) {
        let elementPath = './' + dbDirectory + '/' + group + '/' + element; // path of element to be updated
        let elementObj = JSON.parse(
            await fs.readFile(elementPath) as unknown as string
        ); // read the file
        elementObj[entry] = __encryptMsg(moral[element.slice(0, -5)]); // put value of moralObject to element with encryption
        await fs.writeFile(elementPath, JSON.stringify(elementObj, null, 4)); // write the file
    };
    
    greenConsole("Element/s updated successfully");
    return true;
}

export { editR };
