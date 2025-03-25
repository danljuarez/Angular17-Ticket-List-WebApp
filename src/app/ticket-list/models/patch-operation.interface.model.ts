export interface IPatchOperationRequest {
    op: 'add' | 'remove' | 'replace';
    path: string;
    value?: any;
}
