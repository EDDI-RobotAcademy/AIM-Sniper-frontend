export interface AuthenticationState {
    isAuthenticatedKakao: boolean
    isAdmin: boolean
}

const state: AuthenticationState = {
    isAuthenticatedKakao: false,
    isAdmin: false
}

export default state