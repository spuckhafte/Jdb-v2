import fs from "fs";
import { v4 } from "uuid";
import { __encryptMsg } from "../imports/encryption.js";
import {
    __checkIfDatabaseExists,
    __rGroupIsAuthentic,
    greenConsole,
    redConsole
} from "../imports/methods.js";

// keywords for the module
const tokens = {
    'Db': 'database',
    'rGroup': 'relational group',
    'iGroup': 'individual group',
    'element': 'JSON object in r/i groups',
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element',
    'create': 'function to create a new query'
}


interface CreateQueries {
    "Db": { name: string },
    "rGroup": { name: string },
    "iGroup": { name: string },
    "element": {
        group: string,
        name: string,
    }
}

async function create<T extends keyof CreateQueries>(
    token: T,
    query: CreateQueries[T]
) {

    // check if token is valid
    if (!Object.keys(tokens).includes(token)) return false;


    // creating a database folder
    if (token === "Db") {
        let path = './Db-' + query.name; // it starts with 'Db-'
        // check if the folder already exists
        if (fs.existsSync(path)) {
            redConsole("Database already exists");
            return false;
        }

        fs.mkdirSync(path);

        greenConsole('Database created successfully');
        return true;
    }

    // creating a group
    if (token === 'rGroup' || token === 'iGroup') {
        let dbDirectory = __checkIfDatabaseExists(); // checking if database exists

        if (!dbDirectory) {
            redConsole("No database found");
            return false;
        }

        // create path for the new relational group (dir) in database
        let path = './' + dbDirectory + '/' + query.name;

        if (fs.existsSync(path)) { // Group should not already exist
            redConsole("Group already exists");
            return false;
        }

        fs.mkdirSync(path)
        // add a config file to it, to specify the group
        let path2 = './' + dbDirectory + '/' + query.name + '/__config.json';

        let rConfig = { 'type': 'rGroup', 'elements': '0' }; // respective to the type of group
        let iConfig = { 'type': 'iGroup', 'elements': '0' }; // respective to the type of group

        fs.writeFileSync(path2, JSON.stringify(
            token == 'rGroup' ? rConfig : iConfig // write config file
        ));

        greenConsole('Group created successfully');
        return true;
    }

    // creating an element
    if (token === 'element') {
        let dbDirectory = __checkIfDatabaseExists(); // checking if database exists
        if (!dbDirectory) {
            redConsole("No database found");
            return false;
        }

        const queryForEl = query as {
            name: string,
            group: string
        };

        // check if the group exists
        let checkPathOfGroup = './' + dbDirectory + '/' + queryForEl.group;
        if (!fs.existsSync(checkPathOfGroup)) {
            redConsole("Group does not exists");
            return false;
        }

        // create path for the new element in respective group
        let path =
            './' + dbDirectory + '/' + queryForEl.group + '/' + queryForEl.name + '.json';

        if (fs.existsSync(path)) { // element should not already exist
            redConsole("Element already exists");
            return false;
        }
        // get the config file of the group
        let config = JSON.parse(
            fs.readFileSync(
                './' + dbDirectory + '/' + queryForEl.group + '/__config.json'
            ) as unknown as string
        );

        let element: {
            [index: string]: any
        } = {}; // create an empty element which will be written to the file and edited below

        // check type of group
        if (config['type'] === 'rGroup') { // relational group
            let authenticity = await __rGroupIsAuthentic(dbDirectory, queryForEl.group); // check if all elements have the same keys
            if (!authenticity) { // if all elements have the same keys
                redConsole("RGroup is not Authentic");
                return false;
            }
            // get name of any element in the group (if any)
            let existingElements = fs.readdirSync('./' + dbDirectory + '/' + queryForEl.group);
            existingElements = existingElements.filter(_element => _element !== '__config.json');
            if (existingElements.length === 0) { // if no element exists
                element = {
                    0: __encryptMsg(`${v4()}`) // create a new element with a unique key
                };
            } else {
                // create a new element with a unique key based on previous elements
                element = __fillRGroupElement(dbDirectory, existingElements, queryForEl.group);
            }

            // check if the element already exists and create a new one if it does
            if (fs.existsSync(path)) {
                redConsole("Element already exists");
                return false;
            }
            config['elements'] = parseInt(config['elements']) + 1; // increment the number of elements in the group
            fs.writeFileSync(
                './' + dbDirectory + '/' + queryForEl.group + '/__config.json',
                JSON.stringify(config)
            ); // write the config file

            fs.writeFileSync(path, JSON.stringify(element, null, 4)); // write the element to folder

            greenConsole("Element created successfully");
            return true;
        } else { // individual group

            let existingElements = fs.readdirSync('./' + dbDirectory + '/' + queryForEl.group);
            existingElements == existingElements.filter(_element => _element !== '__config.json')
            element = {
                0: __encryptMsg(`${v4()}`)
            };
            // write the element to folder if it does not exist
            if (fs.existsSync(path)) {
                redConsole("Element already exists");
                return false;
            }

            config['elements'] = parseInt(config['elements']) + 1 // increment the number of elements in the group
            fs.writeFileSync(
                './' + dbDirectory + '/' + queryForEl.group + '/__config.json',
                JSON.stringify(config)
            ); // write the config file

            fs.writeFileSync(path, JSON.stringify(element, null, 4));

            greenConsole('Element created successfully');
            return true;
        }
    }

    redConsole("Token can only be one of these: [Db, rGroup, iGroup, element]");
    return false
}

// if an element is making rGroup un-authentic, adjust it with nulls
function __fillRGroupElement(dbDirectory: string, existingElements: string[], group: string) {
    let __existingEl = existingElements[0];
    // get the keys of the existing element
    let __existingElKeys = Object.keys(JSON.parse(
        fs.readFileSync(
            './' + dbDirectory + '/' + group + '/' + __existingEl
        ) as unknown as string
    ));
    // remove the first key (0)
    __existingElKeys.shift();
    // create element with a unique key
    let __newElement: { [index: string]: any } = {
        0: __encryptMsg(`${v4()}`)
    };
    // create more keys for the element from the existing keys
    __existingElKeys.forEach(_key => {
        __newElement[_key] = __encryptMsg("null");
    })

    return __newElement;
};

export { create, tokens };
