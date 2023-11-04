var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
import { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, __exists, redConsole } from "../imports/methods.js";
import { __encryptMsg } from '../imports/encryption.js';
function editR(group, entry, moral) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbDirectory = __checkIfDatabaseExists();
        if (!dbDirectory) {
            redConsole("Database does not exists");
            return false;
        }
        let checkGroupPath = './' + dbDirectory + '/' + group;
        if (!(yield __exists(checkGroupPath))) {
            redConsole("Group does not exists");
            return false;
        }
        let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
        let groupConfig = JSON.parse((yield fs.readFile(checkGroupConfigPath)))["type"];
        if (groupConfig !== "rGroup") {
            redConsole("Group is not relational");
            return false;
        }
        if (!(yield __rGroupIsAuthentic(dbDirectory, group))) {
            redConsole("rGroup is not authentic");
            return false;
        }
        if (typeof moral !== "object") {
            redConsole("Invalid moral (should be an object)");
            return false;
        }
        let allElementsOfGroup = yield fs.readdir(checkGroupPath);
        let elementsProvided = Object.keys(moral);
        elementsProvided.forEach((_el, _ind) => elementsProvided[_ind] = _el + ".json");
        if (!elementsProvided.every(_el => allElementsOfGroup.includes(_el))) {
            redConsole("Either one of the elements does not exists in the group");
            return false;
        }
        for (let element of elementsProvided) {
            let elementPath = './' + dbDirectory + '/' + group + '/' + element;
            let elementObj = JSON.parse(yield fs.readFile(elementPath));
            elementObj[entry] = __encryptMsg(moral[element.slice(0, -5)]);
            yield fs.writeFile(elementPath, JSON.stringify(elementObj, null, 4));
        }
        ;
        greenConsole("Element/s updated successfully");
        return true;
    });
}
export { editR };
