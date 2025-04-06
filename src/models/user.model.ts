export interface UserGroup{
    group: Group
    id: string
    name: string
}
export interface Group{
    id: string
    name: string
    description: string
}

export interface UserInfo{
    id: string,
    documentId?: string,
    idType: string,
    name: string,
    email: string,
    role: string,
    country: string,
    city: string,
    birthDate: string,
    profilePictureUrl: string,
    // pathId: number,
    userGroups?: UserGroup[],
}