declare function __checkIfDatabaseExists(): string | undefined;
declare function __rGroupIsAuthentic(dbDir: string, rGroup: string): Promise<boolean>;
declare function __exists(path: string): Promise<boolean>;
declare function __getEntry(dbDir: string, group: string, element: string, moral: string): string | undefined;
declare function greenConsole(text: string): void;
declare function yellowConsole(text: string): void;
declare function redConsole(text: string): void;
export { __checkIfDatabaseExists, __rGroupIsAuthentic, __exists, greenConsole, yellowConsole, redConsole, __getEntry, };
