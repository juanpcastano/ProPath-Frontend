export interface Activity{
    id: string;
    name: string;
    description: string;
    hours: number;
    initialDate: Date;
    finalDate: Date;
    budget: number;
    state: string;
    pathId: string;
    comments?: Comment[];
}

export interface Path{
    id: string;
    name: string;
    description: string;
    state: string;
    totalHours: number;
    totalBudget: number;
    activities: Activity[];
    coachComment?:Comment;
    adminComment?:Comment;
}

export interface Comment{
    id: string;
    authorName: string;
    message: string;
    date: Date;
}