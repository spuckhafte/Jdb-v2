const { __checkIfDatabaseExists, __rGroupIsAuthentic, greenConsole, __getEntry } = require('./import/funcs')
const { __decryptMsg, __encryptMsg } = require('./import/encryption');
const tokens = ['entry', 'moral']
const fs = require('fs');

async function getR(group, param, query) { // parameter for getting info can be: entry or moral
    if (tokens.includes(param)) {
        let dbDirectory = __checkIfDatabaseExists();
        if (dbDirectory !== null && dbDirectory !== undefined) { // db exists?
            let elements = fs.readdirSync('./' + dbDirectory + '/' + group) // get all elements in the group
            elements.splice(elements.indexOf('__config.json'), 1) // remove the config file

            let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json';
            let groupConfig = JSON.parse(fs.readFileSync(checkGroupConfigPath))["type"]; // check the type of group

            if (groupConfig == 'rGroup') { // if it is a relational group
                if (await __rGroupIsAuthentic(dbDirectory, group)) { // rGroup is authentic?

                    if (param === 'entry') { // get info of an element based on its entry
                        // get morals of relational group elements of the same entry
                        let entry = query
                        if (entry > 0) { // entry is valid (not 0)?  [0=>refers to id]
                            let morals = {} // get morals of entry in all elements of group in this object
                            elements.forEach(element => { // for each element in the group
                                let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element)); // get the element
                                let elementName = element.slice(0, -5) // remove .json from element name
                                morals['entry'] = query // get current entry
                                morals[elementName] = __decryptMsg(elementObj[entry]) // set the morals of the entry as the value of elements
                            });
                            return morals
                        } else console.error('\x1b[31m[Err]:\x1b[0m entry must be greater than 0');
                    }

                    else if (param === 'moral') { // get info of an entry based on its moral (any)
                        // check if query is array
                        if (Array.isArray(query) && query.length == 2) { // query = [element, moral]
                            let element = query[0];
                            let moral = __encryptMsg(query[1]);
                            if (elements.includes(element + '.json')) { // element exists in group?
                                let requiredEntry = __getEntry(dbDirectory, group, element, moral) // this will be the required entry if it exists
                                if (requiredEntry !== null) {
                                    let requiredMorals = await getR(group, 'entry', requiredEntry) // get details of the required entry
                                    return requiredMorals
                                } else return null;
                            } else console.error('\x1b[31m[Err]:\x1b[0m element does not exist in group')
                        } else console.error('\x1b[31m[Err]:\x1b[0m Query must be an array => [element, moral]')
                    } else console.error('\x1b[31m[Err]:\x1b[0m Parameter is not valid')
                } else console.error('\x1b[31m[Err]:\x1b[0m rGroup is not authentic');
            } else console.error('\x1b[31m[Err]:\x1b[0m Group is not a relational group');
        } else console.error('\x1b[31m[Err]:\x1b[0m No database found')
    } else console.error('\x1b[31m[Err]:\x1b[0m Invalid parameter for getR')
}

function getEl(group, element) {
    let dbDirectory = __checkIfDatabaseExists();
    if (dbDirectory !== null && dbDirectory !== undefined) { // db exists?
        if (fs.existsSync('./' + dbDirectory + '/' + group)) { // group exists?
            let elements = fs.readdirSync('./' + dbDirectory + '/' + group); // get all elements in the group
            // check if element exists in the group
            if (elements.includes(element + '.json')) {
                let returnElementObj = {}
                let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element + '.json'));
                Object.keys(elementObj).forEach(_entry => {
                    returnElementObj[_entry] = __decryptMsg(elementObj[_entry]); // decrypt the morals
                });

                return returnElementObj;
            } else console.error('\x1b[31m[Err]:\x1b[0m element does not exist in group');
        } else console.error('\x1b[31m[Err]:\x1b[0m group does not exist');
    } else console.error('\x1b[31m[Err]:\x1b[0m No database found');
}

module.exports = { getR, getEl }