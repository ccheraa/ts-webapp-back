export declare function isPortFree(port: number, host?: string): {
    _onFree: any;
    _onNotFree: any;
    _callback: any;
    then: (ifFree: any, ifNotFree?: any) => void;
    free: (callback: any) => void;
    not: (callback: any) => void;
    notFree: (callback: any) => void;
    callback: (callback: any) => void;
};
