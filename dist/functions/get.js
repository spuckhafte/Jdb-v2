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
import { __checkIfDatabaseExists, __rGroupIsAuthentic, __getEntry, redConsole, } from "../imports/methods.js";
import { __decryptMsg } from '../imports/encryption.js';
;
function getR(group, param, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (param != "entry" && param != "moral") {
            redConsole("Invalid param, can only be [entry | moral]");
            return null;
        }
        let dbDirectory = __checkIfDatabaseExists();
        if (!dbDirectory) {
            redConsole("No database found");
            return null;
        }
        let elements = fs.readdirSync('./' + dbDirectory + '/' + group);
        elements.splice(elements.indexOf('__config.json'), 1);
        let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
        let groupConfig = JSON.parse(fs.readFileSync(checkGroupConfigPath))["type"];
        if (groupConfig !== 'rGroup') {
            redConsole("Group is not relational");
            return null;
        }
        if (!(yield __rGroupIsAuthentic(dbDirectory, group))) {
            redConsole("rGroup is not Authentic");
            return null;
        }
        let returnData = null;
        if (param === 'entry') {
            let entry = query;
            if (entry <= 0) {
                redConsole("Entry must be greater than 0");
                return null;
            }
            for (let element of elements) {
                let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element));
                if (!Object.keys(elementObj).includes(`${entry}`)) {
                    redConsole("No such entry exists in this rGroup");
                    return null;
                }
                let elementName = element.slice(0, -5);
                if (returnData == null) {
                    returnData = {
                        entry,
                        data: {
                            [elementName]: __decryptMsg(elementObj[entry])
                        }
                    };
                }
                else {
                    returnData = {
                        entry,
                        data: Object.assign(Object.assign({}, returnData.data), { [elementName]: __decryptMsg(elementObj[entry]) })
                    };
                }
            }
            ;
        }
        if (param === 'moral') {
            const { element, moral } = query;
            if (!element || !moral) {
                redConsole("Query is invalid");
                return null;
            }
            if (!elements.includes(element + '.json')) {
                redConsole("Element does not exists in group");
                return null;
            }
            let requiredEntry = __getEntry(dbDirectory, group, element, moral);
            if (requiredEntry) {
                let data = yield getR(group, 'entry', +requiredEntry);
                if (!data) {
                    redConsole("No described record exists");
                    return null;
                }
                returnData = data;
            }
            else {
                redConsole("No record of such moral exists in the given element");
                return null;
            }
        }
        return returnData;
    });
}
function getEl(group, element) {
    let dbDirectory = __checkIfDatabaseExists();
    if (!dbDirectory) {
        redConsole("No database found");
        return null;
    }
    if (!fs.existsSync('./' + dbDirectory + '/' + group)) {
        redConsole("Group does not exists");
        return null;
    }
    let elements = fs.readdirSync('./' + dbDirectory + '/' + group);
    if (!elements.includes(element + '.json')) {
        redConsole("Element does not exists in the group");
        return null;
    }
    let returnElementObj = {};
    let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element + '.json'));
    Object.keys(elementObj).forEach(_entry => {
        returnElementObj[_entry] = __decryptMsg(elementObj[_entry]);
    });
    return returnElementObj;
}
export { getR, getEl };
