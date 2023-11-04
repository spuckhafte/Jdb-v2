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
import fsP from "fs/promises";
import { __decryptMsg } from './encryption.js';
function __checkIfDatabaseExists() {
    let __folders = fs.readdirSync('./');
    let __dbDirectory = __folders.find(_folder => _folder.startsWith('Db-'));
    if (__dbDirectory) {
        let __dbDirectoryPath = fs.statSync(process.cwd() + '/' + __dbDirectory);
        if (__dbDirectoryPath.isDirectory())
            return __dbDirectory;
    }
}
;
function __rGroupIsAuthentic(dbDir, rGroup) {
    return __awaiter(this, void 0, void 0, function* () {
        let __files = yield fsP.readdir('./' + dbDir + '/' + rGroup);
        __files = __files.filter(_file => _file !== '__config.json');
        let __keys = [];
        __files.forEach((__file) => __awaiter(this, void 0, void 0, function* () {
            let __fileObj = JSON.parse(yield fsP.readFile('./' + dbDir + '/' + rGroup + '/' + __file));
            let __fileKeys = Object.keys(__fileObj);
            __keys.concat(__fileKeys);
        }));
        let __keysAreSame = true;
        ;
        for (let i = 0; i < __keys.length; i++) {
            if (JSON.stringify(__keys[i]) !== JSON.stringify(__keys[0])) {
                __keysAreSame = false;
                break;
            }
        }
        return __keysAreSame;
    });
}
;
function __exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fsP.access(path);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
;
function __getEntry(dbDir, group, element, moral) {
    let elementObj = JSON.parse(fs.readFileSync('./' + dbDir + '/' + group + '/' + element + '.json'));
    let entries = Object.keys(elementObj);
    let requiredEntry;
    entries.forEach(entry => {
        if (__decryptMsg(elementObj[entry]) === moral) {
            requiredEntry = entry;
        }
    });
    return requiredEntry;
}
;
function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m');
}
;
function yellowConsole(text) {
    console.log('\x1b[33m' + text + '\x1b[0m');
}
;
function redConsole(text) {
    console.error(`\x1b[31m[Err]: ${text}\x1b[0m`);
}
export { __checkIfDatabaseExists, __rGroupIsAuthentic, __exists, greenConsole, yellowConsole, redConsole, __getEntry, };
