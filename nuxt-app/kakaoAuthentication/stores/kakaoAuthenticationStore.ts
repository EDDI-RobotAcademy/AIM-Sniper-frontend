import {kakaoAuthenticationActions} from "./kakaoAuthenticationActions"
import {kakaoAuthenticationState} from "./kakaoAuthenticationState"
import { defineStore } from "pinia";

export const kakaoAuthenticationStore = defineStore("kakoAuthenticationStore",{
    state: kakaoAuthenticationState,
    actions: kakaoAuthenticationActions
})