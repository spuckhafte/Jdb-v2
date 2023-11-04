var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import { v4 } from "uuid";
import { __encryptMsg } from "../imports/encryption.js";
import { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, redConsole } from "../imports/methods.js";
const tokens = {
    'Db': 'database',
    'rGroup': 'relational group',
    'iGroup': 'individual group',
    'element': 'JSON object in r/i groups',
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element',
    'create': 'function to create a new query'
};
function create(token, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Object.keys(tokens).includes(token))
            return false;
        if (token === "Db") {
            let path = './Db-' + query.name;
            if (fs.existsSync(path)) {
                redConsole("Database already exists");
                return false;
            }
            fs.mkdirSync(path);
            greenConsole('Database created successfully');
            return true;
        }
        if (token === 'rGroup' || token === 'iGroup') {
            let dbDirectory = __checkIfDatabaseExists();
            if (!dbDirectory) {
                redConsole("No database found");
                return false;
            }
            let path = './' + dbDirectory + '/' + query.name;
            if (fs.existsSync(path)) {
                redConsole("Group already exists");
                return false;
            }
            fs.mkdirSync(path);
            let path2 = './' + dbDirectory + '/' + query.name + '/__config.json';
            let rConfig = { 'type': 'rGroup', 'elements': '0' };
            let iConfig = { 'type': 'iGroup', 'elements': '0' };
            fs.writeFileSync(path2, JSON.stringify(token == 'rGroup' ? rConfig : iConfig));
            greenConsole('Group created successfully');
            return true;
        }
        if (token === 'element') {
            let dbDirectory = __checkIfDatabaseExists();
            if (!dbDirectory) {
                redConsole("No database found");
                return false;
            }
            const queryForEl = query;
            let checkPathOfGroup = './' + dbDirectory + '/' + queryForEl.group;
            if (!fs.existsSync(checkPathOfGroup)) {
                redConsole("Group does not exists");
                return false;
            }
            let path = './' + dbDirectory + '/' + queryForEl.group + '/' + queryForEl.name + '.json';
            if (fs.existsSync(path)) {
                redConsole("Element already exists");
                return false;
            }
            let config = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + queryForEl.group + '/__config.json'));
            let element = {};
            if (config['type'] === 'rGroup') {
                let authenticity = yield __rGroupIsAuthentic(dbDirectory, queryForEl.group);
                if (!authenticity) {
                    redConsole("RGroup is not Authentic");
                    return false;
                }
                let existingElements = fs.readdirSync('./' + dbDirectory + '/' + queryForEl.group);
                existingElements = existingElements.filter(_element => _element !== '__config.json');
                if (existingElements.length === 0) {
                    element = {
                        0: __encryptMsg(`${v4()}`)
                    };
                }
                else {
                    element = __fillRGroupElement(dbDirectory, existingElements, queryForEl.group);
                }
                if (fs.existsSync(path)) {
                    redConsole("Element already exists");
                    return false;
                }
                config['elements'] = parseInt(config['elements']) + 1;
                fs.writeFileSync('./' + dbDirectory + '/' + queryForEl.group + '/__config.json', JSON.stringify(config));
                fs.writeFileSync(path, JSON.stringify(element, null, 4));
                greenConsole("Element created successfully");
                return true;
            }
            else {
                let existingElements = fs.readdirSync('./' + dbDirectory + '/' + queryForEl.group);
                existingElements == existingElements.filter(_element => _element !== '__config.json');
                element = {
                    0: __encryptMsg(`${v4()}`)
                };
                if (fs.existsSync(path)) {
                    redConsole("Element already exists");
                    return false;
                }
                config['elements'] = parseInt(config['elements']) + 1;
                fs.writeFileSync('./' + dbDirectory + '/' + queryForEl.group + '/__config.json', JSON.stringify(config));
                fs.writeFileSync(path, JSON.stringify(element, null, 4));
                greenConsole('Element created successfully');
                return true;
            }
        }
        redConsole("Token can only be one of these: [Db, rGroup, iGroup, element]");
        return false;
    });
}
function __fillRGroupElement(dbDirectory, existingElements, group) {
    let __existingEl = existingElements[0];
    let __existingElKeys = Object.keys(JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + __existingEl)));
    __existingElKeys.shift();
    let __newElement = {
        0: __encryptMsg(`${v4()}`)
    };
    __existingElKeys.forEach(_key => {
        __newElement[_key] = __encryptMsg("null");
    });
    return __newElement;
}
;
export { create, tokens };
