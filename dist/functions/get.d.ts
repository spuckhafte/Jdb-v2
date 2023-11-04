interface GetRQueries {
    "entry": number;
    "moral": {
        element: string;
        moral: string;
    };
}
declare function getR<T extends keyof GetRQueries>(group: string, param: T, query: GetRQueries[T]): Promise<{
    entry: number;
    data: {
        [index: string]: string;
    };
} | null>;
declare function getEl(group: string, element: string): {
    [index: string]: any;
} | null;
export { getR, getEl };
