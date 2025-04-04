export interface Group{
    id: string
    name: string
}

export interface UserInfo{
    id: string,
    idType: string,
    name: string,
    email: string,
    role: string,
    country: string,
    city: string,
    birthDate: string,
    profilePictureUrl: string,
    pathId: number,
    groups?: Group[],
}