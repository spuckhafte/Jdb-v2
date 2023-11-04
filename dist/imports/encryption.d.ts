declare class EncryptionMachine {
    config: number[];
    constructor();
    encrypt(word: string): string;
    decrypt(word: string): string;
}
declare class JdbEncryptionMachine extends EncryptionMachine {
    dataEncryption: boolean;
    constructor();
}
declare const Machine: JdbEncryptionMachine;
declare function __encryptMsg(msg: string): string;
declare function __decryptMsg(msg: string): string;
export { __encryptMsg, __decryptMsg, Machine };
