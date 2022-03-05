const { create } = require('./functions/create');
const { getR, getEl } = require('./functions/get');
const { assignR, assignI } = require('./functions/put');

// assignI('test_init', 'test', {
//     "test": "test",
//     "test2": "255"
// })


// assignR('test_users', {
//     "name": "vivek",
//     "pass": "pass2"
// })

// console.log(getR('test_users', 'moral', ['name', 'rakshit']))

module.exports = { create, getR, getEl, assignR, assignI };