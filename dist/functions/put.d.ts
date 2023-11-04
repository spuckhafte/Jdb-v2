declare function assignR(group: string, moralQuery: {
    [index: string]: any;
}): Promise<number>;
declare function assignI(group: string, element: string, primeQuery: {
    [index: string]: any;
}): Promise<boolean>;
export { assignR, assignI };
