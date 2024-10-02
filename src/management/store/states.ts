export interface ManagementState {
    userList: User[]
    user: User | null 
}


export interface User {
    userId: number
    email: string,
    gender: string,
    birthyear: number,
    login_type: string,
    role_type: string,
    last_login: Date
}

const state: ManagementState = {
    userList: [],
    user: null,
}

export default state