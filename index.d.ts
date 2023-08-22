
export interface Options {
    level?: string,
    title?: string,
    pretty?: boolean,
    cache?: number,
    end?: string,
    color?: boolean | string,
    noTags?: boolean,

    output?: any,
    writeCallback?: Function,
}

export default class Poplar {
    constructor (opts?: Options);
    getLevel () : string;
    setLevel (level: string): void;
    getPretty (): boolean;
    setPretty (pretty: boolean): void;
    getTitle (): string;
    setTitle (title: string): void;

    flush (): void;
    child () : Poplar;

    // log (level: string, ...args: any[]): void;

    fatal (...args: any[]): void;
    error (...args: any[]): void;
    warn (...args: any[]): void;
    info (...args: any[]): void;
    debug (...args: any[]): void;
    trace (...args: any[]): void;
}

export const Logger : Poplar;
export const PrettyLogger: Poplar;
export const CacheLogger: Poplar;
