import { tryUseNuxtApp } from "nuxt/app";
import * as axiosUtility from "../../utility/axiosInstance";
import { AxiosResponse } from "axios"
import { kakaoAuthenticationStore } from "./kakaoAuthenticationStore";

export const kakaoAuthenticationActions = {
    async requestKakaoOauthRedirectionToDjango(): Promise<void> {
            const {djangoAxiosInst} = axiosUtility.createAxiosInstances();
        try{
            return await djangoAxiosInst.get("/github-oauth/github").then((res) => {
                window.location.href = res.data.url;
            })
        } catch (error) {
            console.error("requestGithubOauthRedirectionToDjango() axios 오류!", error)
            }
        },
        async requestAccessTokenToDjangoRedirection(code): Promise<void>{
            const {djangoAxiosInst} = axiosUtility.createAxiosInstances();
            const kakaoAuthenticationState = kakaoAuthenticationStore()
    
            try {
    
                const response = await djangoAxiosInst.post(
                    '/kakao_oauth/kakao/access-token', { code })
                sessionStorage.setItem("accessToken", response.data.accessToken.access_token)
            } catch (error) {
                console.log('Access Token 요청 중 문제 발생:', error)
                throw error
            }
        },
        async requestUserInfoToDjango(): Promise<any> {
            const {djangoAxiosInst} = axiosUtility.createAxiosInstances();
            const kakaoAuthenticationState = kakaoAuthenticationStore()

            try {
                const accessToken = sessionStorage.getItem("accessToken");
                const userInfoResponse: AxiosResponse<any> =
                    await djangoAxiosInst.post(
                        '/kakao_oauth/kakao/user-info',
                        { access_token: accessToken });
    
                const userInfo = userInfoResponse.data.user_info
                return userInfo
    
            } catch (error) {
                alert('사용자 정보 가져오기 실패!')
                throw error;
            }
        },
        async requestAddRedisAccessTokenToDjango(
            { email, accessToken }: { email: string, accessToken: string }
        ): Promise<any> {
            const {djangoAxiosInst} = axiosUtility.createAxiosInstances();
            const kakaoAuthenticationState = kakaoAuthenticationStore()

            try {
                const response: AxiosResponse<any> = await djangoAxiosInst.post(
                    '/kakao_oauth/redis-access-token/', {
                    email: email,
                    accessToken: accessToken
                });
    
                // console.log('userToken:', response.data.userToken)
    
                sessionStorage.removeItem("accessToken")
                sessionStorage.setItem("userToken", response.data.userToken)
                kakaoAuthenticationState.isAuthenticatedKakao = true
                return response.data;
            } catch (error) {
                console.error('Error adding redis access token:', error);
                throw error;
            }
        },
        async requestKakaoLogoutToDjango(): Promise<void> {
            try {
                const {djangoAxiosInst} = axiosUtility.createAxiosInstances();
                const kakaoAuthenticationState = kakaoAuthenticationStore()

                const userToken = sessionStorage.getItem("userToken")
                const adminToken = sessionStorage.getItem("adminToken")
                if (userToken){
                const res =
                    await djangoAxiosInst.post('/kakao_oauth/logout', {
                        userToken: userToken
                    })
    
                // console.log('res:', res.data.isSuccess)
                if (res.data.isSuccess === true) {
                    kakaoAuthenticationState.isAuthenticatedKakao = false
                    }
                }else{
                    const res = await djangoAxiosInst.post('/kakao_oauth/logout', {
                        userToken: adminToken
                    })
                // console.log('res:', res.data.isSuccess)
                if (res.data.isSuccess === true) {
                    kakaoAuthenticationState.isAuthenticatedKakao = false
                    }
                }
            } catch (error) {
                console.error('requestKakaoLogoutToDjango() 중 에러 발생:', error)
                throw error
            }
            sessionStorage.removeItem("userToken")
            sessionStorage.removeItem('adminToken')
            sessionStorage.removeItem("email")
            sessionStorage.removeItem("loginType")
            if (sessionStorage.getItem("fileKey")) {
                sessionStorage.removeItem("fileKey")
            }
        }


    }