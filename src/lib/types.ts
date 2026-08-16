export interface Competitor {
    id: number;
    name: string;
    state: 'active' | 'failed' | 'succeded';
    time: number | undefined;
    organizationId: number | undefined;
}

export interface Class {
    id: number;
    name: string;
}

export interface Organization {
    id: number;
    name: string;
}
