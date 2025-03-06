export interface Activity{
    id: string;
    name: string;
    description: string;
    hours: number;
    initialDate: Date;
    finalDate: Date;
    budget: number;
    state: string;
    pathId: number;
}

export interface Path{
    id: string;
    name: string;
    description: string;
    state: string;
    totalHours: number;
    totalBudget: number;
    activities: Activity[];
}