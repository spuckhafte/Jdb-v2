import fs from "fs";
import {
    __checkIfDatabaseExists,
    __rGroupIsAuthentic,
    __exists,
    __getEntry,
    redConsole,
} from "../imports/methods.js";
import { __encryptMsg, __decryptMsg } from '../imports/encryption.js';

interface GetRQueries {
    "entry": number,
    "moral": {
        element: string,
        moral: string
    },
};

async function getR<T extends keyof GetRQueries>(
    group: string,
    param: T,
    query: GetRQueries[T]
): Promise<{
    entry: number,
    data: {
        [index: string]: string,
    }
} | null> {
    if (param != "entry" && param != "moral") {
        redConsole("Invalid param, can only be [entry | moral]");
        return null;
    }

    let dbDirectory = __checkIfDatabaseExists();
    if (!dbDirectory) {
        redConsole("No database found");
        return null;
    }

    let elements = fs.readdirSync('./' + dbDirectory + '/' + group) // get all elements in the group
    elements.splice(elements.indexOf('__config.json'), 1) // remove the config file

    let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
    let groupConfig: string = JSON.parse(
        fs.readFileSync(checkGroupConfigPath) as unknown as string
    )["type"]; // check the type of group

    if (groupConfig !== 'rGroup') {
        redConsole("Group is not relational");
        return null;
    }

    if (!(await __rGroupIsAuthentic(dbDirectory, group))) {
        redConsole("rGroup is not Authentic");
        return null;
    }

    let returnData: {
        entry: number,
        data: {
            [index: string]: string,
        }
    } | null = null;

    if (param === 'entry') { // get info of an element based on its entry
        // get morals of relational group elements of the same entry
        let entry = query as number;
        if (entry <= 0) { // entry is valid (not 0)?  [0=>refers to id]
            redConsole("Entry must be greater than 0");
            return null;
        }

        for (let element of elements) { // for each element in the group
            let elementObj = JSON.parse(
                fs.readFileSync(
                    './' + dbDirectory + '/' + group + '/' + element
                ) as unknown as string
            ); // get the element

            if (!Object.keys(elementObj).includes(`${entry}`)) {
                redConsole("No such entry exists in this rGroup");
                return null;
            }

            let elementName = element.slice(0, -5) // remove .json from element name

            if (returnData == null) {
                returnData = {
                    entry,
                    data: {
                        [elementName]: __decryptMsg(elementObj[entry])
                    }
                }
            } else {
                returnData = {
                    entry,
                    data: {
                        ...(returnData.data as object),
                        [elementName]: __decryptMsg(elementObj[entry])
                    }
                }
            }
        };
    }
    if (param === 'moral') { // get info of an entry based on its moral (any)
        const { element, moral } = query as {
            element: string,
            moral: string
        };

        if (!element || !moral) {
            redConsole("Query is invalid");
            return null;
        }

        if (!elements.includes(element + '.json')) { // element exists in group?
            redConsole("Element does not exists in group");
            return null;
        }

        let requiredEntry = __getEntry(dbDirectory, group, element, moral) // this will be the required entry if it exists
        if (requiredEntry) {
            let data = await getR(group, 'entry', +requiredEntry) // get details of the required entry
            if (!data) {
                redConsole("No described record exists");
                return null;
            }
            returnData = data;
        } else {
            redConsole("No record of such moral exists in the given element");
            return null;
        }
    }

    return returnData;
}

function getEl(group: string, element: string) {
    let dbDirectory = __checkIfDatabaseExists();
    if (!dbDirectory) {
        redConsole("No database found");
        return null;
    }

    if (!fs.existsSync('./' + dbDirectory + '/' + group)) {
        redConsole("Group does not exists");
        return null;
    }

    let elements = fs.readdirSync('./' + dbDirectory + '/' + group); // get all elements in the group

    if (!elements.includes(element + '.json')) {
        redConsole("Element does not exists in the group");
        return null;
    }

    let returnElementObj: { [index: string]: any } = {};

    let elementObj = JSON.parse(
        fs.readFileSync(
            './' + dbDirectory + '/' + group + '/' + element + '.json'
        ) as unknown as string,
    );

    Object.keys(elementObj).forEach(_entry => {
        returnElementObj[_entry] = __decryptMsg(elementObj[_entry]); // decrypt the morals
    });

    return returnElementObj;
}

export { getR, getEl };