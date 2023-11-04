var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
};
import { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, yellowConsole, __exists, redConsole } from "../imports/methods.js";
import { __encryptMsg } from "../imports/encryption.js";
import fs from "fs/promises";
function assignR(group, moralQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbDirectory = __checkIfDatabaseExists();
        if (!dbDirectory) {
            redConsole("No database found");
            return -1;
        }
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (!(yield __exists(checkGroupPath))) {
            redConsole("Group does not exists");
            return -1;
        }
        let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
        let groupConfig = JSON.parse(yield fs.readFile(checkGroupConfigPath))["type"];
        if (groupConfig !== 'rGroup') {
            redConsole("Group is not relational");
            return -1;
        }
        if (!(yield __rGroupIsAuthentic(dbDirectory, group))) {
            redConsole("rGroup is not authentic");
            return -1;
        }
        if (typeof moralQuery !== 'object') {
            redConsole("Moral query provided is invalid, not an object");
            return -1;
        }
        let allElementsOfGroup = yield fs.readdir(checkGroupPath);
        allElementsOfGroup.splice(allElementsOfGroup.indexOf('__config.json'), 1);
        let elementsOfMoral = Object.keys(moralQuery);
        elementsOfMoral.forEach((element, index) => {
            elementsOfMoral[index] = element + '.json';
        });
        if (allElementsOfGroup.every(element => elementsOfMoral.includes(element))) {
            let firstElement = JSON.parse(yield fs.readFile(checkGroupPath + '/' + allElementsOfGroup[0]));
            let lengthOfFirstElement = Object.keys(firstElement).length;
            elementsOfMoral.forEach((key) => __awaiter(this, void 0, void 0, function* () {
                let elementPath = './' + dbDirectory + '/' + group + '/' + key;
                let elementFile = yield fs.readFile(elementPath);
                let element = JSON.parse(elementFile);
                key = key.slice(0, -5);
                element[lengthOfFirstElement] = __encryptMsg(moralQuery[key]);
                yield fs.writeFile(elementPath, JSON.stringify(element, null, 4));
            }));
            greenConsole('R-Moral assigned successfully');
            return lengthOfFirstElement;
        }
        else {
            yellowConsole("[Warning] All elements in the group were not found");
            let remainingEntries = allElementsOfGroup.filter(element => !elementsOfMoral.includes(element) && allElementsOfGroup.includes(element));
            if (remainingEntries.length == 0) {
                redConsole("Morals of unkown entries");
                return -1;
            }
            remainingEntries.forEach(element => {
                elementsOfMoral.push(element);
                element = element.slice(0, -5);
                moralQuery[element] = __encryptMsg("null");
            });
            let firstElement = JSON.parse(yield fs.readFile(checkGroupPath + '/' + allElementsOfGroup[0]));
            let lengthOfFirstElement = Object.keys(firstElement).length;
            elementsOfMoral.forEach((key) => __awaiter(this, void 0, void 0, function* () {
                let elementPath = './' + dbDirectory + '/' + group + '/' + key;
                let elementFile = yield fs.readFile(elementPath);
                let element = JSON.parse(elementFile);
                key = key.slice(0, -5);
                element[lengthOfFirstElement] = __encryptMsg(moralQuery[key]);
                yield fs.writeFile(elementPath, JSON.stringify(element, null, 4));
            }));
            greenConsole('R-Morals assigned successfully');
            return lengthOfFirstElement;
        }
    });
}
;
function assignI(group, element, primeQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbDirectory = __checkIfDatabaseExists();
        if (!dbDirectory) {
            redConsole("No database found");
            return false;
        }
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (!(yield __exists(checkGroupPath))) {
            redConsole("Group does not exists");
            return false;
        }
        let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
        let groupConfig = JSON.parse(yield fs.readFile(checkGroupConfigPath))["type"];
        if (groupConfig !== 'iGroup') {
            redConsole("Group is not an [iGroup] (individual group)");
            return false;
        }
        if (typeof primeQuery !== 'object') {
            redConsole("primeQuery is invalid, not an object :: (for an element) { prime: value }");
            return false;
        }
        let elementPath = './' + dbDirectory + '/' + group + '/' + element + '.json';
        if (!(yield __exists(elementPath))) {
            redConsole("Element does not exists");
            return false;
        }
        let elementFile = yield fs.readFile(elementPath);
        let elementData = JSON.parse(elementFile);
        let encryptedPrimeObject = {};
        Object.keys(primeQuery).forEach(key => {
            encryptedPrimeObject[key] = __encryptMsg(primeQuery[key]);
        });
        let newElement = Object.assign(elementData, encryptedPrimeObject);
        yield fs.writeFile(elementPath, JSON.stringify(newElement, null, 4));
        greenConsole('I-Moral assigned successfully');
        return true;
    });
}
;
export { assignR, assignI };
