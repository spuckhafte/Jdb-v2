# Jdb-v2
**For details check: https://github.com/spuckhafte/JSON-Database**<br>
This is the second version of the **JSON Database**.<br>
For contribution: **Discord: spuckhafte#7109**

**Changes:**
1. Organized code
2. `Assign()` is *asynchronous*.
3. The morals are encrypted, makes it difficult to read the JSON file
4. Morals of rGroup elements can be **edited**

## How?
1. Download this project
2. Import it
```js
const jdb = require('./Jdb-v2/jdb')
```
3. Create database:
```js
jdb.create('Db', 'myDatabase')
// run the file and comment out this command
```
4. Create Groups
```js
jdb.create('rGroup', 'users')
jdb.create('iGroup', 'information')
// run file and comment out these 2 lines
```
5. Create elements in groups
```js
create('element', 'test_users', 'name');
create('element', 'test_users', 'pass');
create('element', 'test_init', 'test');
// run file and comment out these lines
```
6. Assign data to iGroup element
```js
assignI('test_init', 'test', {
     "test": "test",
     "test2": "255"
})
// run file and comment out these lines
```
7. Get the data from iElement ; assign to rGroup elements
```js
console.log(getEl('test_init', 'test'));
assignR('test_users', {
     "name": "user232",
     "pass": "pass2"
})
// run file and comment out these lines
```
8. Get whole elements as data or get bits of data from elements
```js
console.log(getEl('test_users', 'name'));
console.log(getEl('test_users', 'pass'));
console.log(getR('test_users', 'entry', '1'));
console.log(getR('test_users', 'moral', ['name', 'user232']));
// run file and comment out these lines
```
9. Edit rGroup elements
```js
editR('test_users', '1', {
     "name": "spuckhafte",
     "pass": "strong_password"
})
// run file and comment out these lines
```
10. Get the edited data
```js
console.log(getR('test_users', 'entry', '1'))
console.log(getR('test_users', 'moral', ['name', 'spuckhafte']))
// run file and comment out these lines
```
11. Get everything one last time
```js
console.log(getEl('test_init', 'test'))
console.log(getEl('test_users', 'name'))
console.log(getEl('test_users', 'pass'))
// run file and comment out these lines
```
