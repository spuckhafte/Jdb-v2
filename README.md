![JDb-cropped](https://user-images.githubusercontent.com/70335252/166429064-235decd8-a4ad-4e06-85ef-b4cc81a1d446.jpeg)

# JDb - JSON Database
## **To get the concept, check:<br/> https://github.com/spuckhafte/JSON-Database**<br>
This is the latest version of the **JSON Database**.<br>
For contribution: **Discord: spuckhafte#7109**

## Logs:
*3 March 22*<br/>
⭐ **Organized code<br/>**
⭐ **`Assign()` is *asynchronous***<br/><br/>
*5 March 22*<br/>
⭐ **The morals are encrypted, makes it difficult to read the JSON file**<br/><br/>
*8 March 22*<br/>
⭐ Morals of rGroup elements can be **edited**<br/><br/>
*3 May 22*<br/>
⭐ <a href='https://www.npmjs.com/package/encdenc'>EncDenc<a/> module is handling the encryption<br/><br/>
*29 May 22*<br/>
⭐ Update the config (encdenc) from your main file, *before: you had to update the node module itself in order to update the config*
<hr>

### ⚠️You should edit the config array and make it unique for the best use of EncDenc encryption module:<br/> `./functions/import/encryption.js`
**Read more at https://www.npmjs.com/package/encdenc**

## How To Use?
1. Install the package
```js 
npm i json-db-jdb
```

2. Import it
```js
const jdb = require('json-db-jdb/jdb')
```
3. Create database:
```js
// Params: EntityType, EntityName
jdb.create('Db', 'myDatabase')
// run the file and comment out this command
```
4. Create Groups
```js
// Params: EntityType, EntityName
jdb.create('rGroup', 'test_users')
jdb.create('iGroup', 'test_init')
// run file and comment out these 2 lines
```
5. Create elements in groups
```js
// Params: EntityType, EntityGroup, EntityName
create('element', 'test_users', 'name');
create('element', 'test_users', 'pass');
create('element', 'test_init', 'test');
// run file and comment out these lines
```
6. Assign data to iGroup element
```js
// Params: GroupName, ElementName, Prime-Moral-Object 
assignI('test_init', 'test', {
     "test": "test",
     "test2": "255"
})
// run file and comment out these lines
```
7. Get the data from iElement ; assign to rGroup elements
```js
// Params: GroupName, ElementName
console.log(getEl('test_init', 'test'));

// Params: GroupName, Element-Moral-Object
assignR('test_users', {
     "name": "user232",
     "pass": "pass2"
})
// run file and comment out these lines
```
8. Get whole elements as data or get bits of data from elements
```js
// Params: GroupName, ElementName
console.log(getEl('test_users', 'name'));
console.log(getEl('test_users', 'pass'));

// Params: GroupName, GetWithRespectTo, Query
console.log(getR('test_users', 'entry', '1'));
console.log(getR('test_users', 'moral', ['name', 'user232']));
// run file and comment out these lines
```
9. Edit rGroup elements
```js
// GroupName, Entry, Element-Moral-Object
editR('test_users', '1', {
     "name": "spuckhafte",
     "pass": "strong_password"
})
// run file and comment out these lines
```
10. Get the edited data
```js
// Params: GroupName, GetWithRespectTo, Query
console.log(getR('test_users', 'entry', '1'))
console.log(getR('test_users', 'moral', ['name', 'spuckhafte']))
// run file and comment out these lines
```
11. Get everything one last time
```js
// Params: GroupName, ElementName
console.log(getEl('test_init', 'test'))
console.log(getEl('test_users', 'name'))
console.log(getEl('test_users', 'pass'))
// run file and comment out these lines
```
