declare const tokens: {
    Db: string;
    rGroup: string;
    iGroup: string;
    element: string;
    entry: string;
    prime: string;
    moral: string;
    create: string;
};
interface CreateQueries {
    "Db": {
        name: string;
    };
    "rGroup": {
        name: string;
    };
    "iGroup": {
        name: string;
    };
    "element": {
        group: string;
        name: string;
    };
}
declare function create<T extends keyof CreateQueries>(token: T, query: CreateQueries[T]): Promise<boolean>;
export { create, tokens };
