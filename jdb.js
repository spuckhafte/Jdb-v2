const { create } = require('./functions/create');
const { getR, getEl } = require('./functions/get');
const { assignR, assignI } = require('./functions/put');
const { editR } = require('./functions/edit')
const { Machine } = require('./functions/import/encryption');

// create('Db', 'data')

// create('rGroup', 'test_users');
// create('iGroup', 'test_init');

// create('element', 'test_users', 'name');
// create('element', 'test_users', 'pass');
// create('element', 'test_init', 'test');

// assignI('test_init', 'test', {
//     "test": "test",
//     "test2": "255"
// })

// console.log(getEl('test_init', 'test'));

// assignR('test_users', {
//     "name": "user232",
//     "pass": "pass2"
// })

// console.log(getEl('test_users', 'name'));
// console.log(getEl('test_users', 'pass'));
// console.log(getR('test_users', 'entry', '1'));
// console.log(getR('test_users', 'moral', ['name', 'user232']));

// editR('test_users', '1', {
//     "name": "spuckhafte",
//     "pass": "hesoyam"
// })

// console.log(getR('test_users', 'entry', '1'))
// console.log(getR('test_users', 'moral', ['name', 'spuckhafte']))

// console.log(getEl('test_init', 'test'))
// console.log(getEl('test_users', 'name'))
// console.log(getEl('test_users', 'pass'))

module.exports = { create, getR, getEl, assignR, assignI, editR, Machine };