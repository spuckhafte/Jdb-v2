// these algorithms just convert text to binary and back

// Create your own encryption algorithm for more security

function __encryptMsg(msg) {
    let __encryptedMsg = msg;
    let __binaryMsg = '';
    for (let i = 0; i < __encryptedMsg.length; i++) {
        __binaryMsg += __encryptedMsg.charCodeAt(i).toString(2) + ' ';
    } return __binaryMsg;
}

function __decryptMsg(msg) {
    let msg_arr = msg.split(' ');
    msg = '';
    for (let i = 0; i < msg_arr.length; i++) {
        msg += String.fromCharCode(parseInt(msg_arr[i], 2));
    }
    return msg.replace(/\x00/g, '');
}

module.exports = { __encryptMsg, __decryptMsg };