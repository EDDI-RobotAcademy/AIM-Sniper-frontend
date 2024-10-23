<template>
    <v-app-bar color="transparent" app dark height="72" class="menu-bar">        
      
      <v-btn text @click="goToHome" class="navbar-logo-btn">
        <v-img
          class="home-icon"
          src="@/assets/images/fixed/AIM_BI_White.png"
          alt="AIM LOGO"
          contain
          height="56" 
          width="56"
          cover
        ></v-img>       
      </v-btn>   
      
      <v-spacer></v-spacer>
  
      <v-btn text @click="goToHome" class="btn-text">
        HOME
      </v-btn>
  
      <v-btn v-if="isNormalAdmin || isGoogleAdmin || isKakaoAdmin || isNaverAdmin" text @click="goToSurveyListPage" class="btn-text">
        SURVEY
      </v-btn>
      <v-btn v-if="!isNormalAdmin && !isGoogleAdmin && !isKakaoAdmin && !isNaverAdmin" text @click="goToSurvey" class="btn-text">
        SURVEY
      </v-btn>
  
      <v-btn text @click="goToProductList" class="btn-text">
        COMPANY REPORT
      </v-btn>   
      <!-- <v-btn text @click="goToAiInterviewPage" class="btn-text">
        AI INTERVIEW
      </v-btn> -->
      <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
              <b>AI Interview</b>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in aiInterviewPageList"
              :key="index"
              @click="item.action"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
      </v-menu>
  
      <v-spacer></v-spacer>
  
      <v-menu
        v-if="
          isAuthenticatedKakao ||
          isAuthenticatedGoogle ||
          isAuthenticatedNormal ||
          isAuthenticatedNaver
        "
        close-on-content-click
      >
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
            <b>My Page</b>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in myPageItems"
            :key="index"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        v-if="isNormalAdmin ||
        isGoogleAdmin ||
        isKakaoAdmin ||
        isNaverAdmin"
        close-on-content-click
      >
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="btn-text" style="margin-right: 14px">
            <b>ADMIN</b>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in adminPageList"
            :key="index"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>    
  
      <v-btn v-if="!isAuthenticatedKakao && !isAuthenticatedGoogle && !isAuthenticatedNormal && !isAuthenticatedNaver && !isNormalAdmin && !isKakaoAdmin && !isGoogleAdmin && !isNaverAdmin" text @click="signIn" class="btn-login">
        <!-- <v-icon left>mdi-login</v-icon> -->
         LOGIN
      </v-btn>
      
      <v-btn v-else text @click="signOut" class="btn-logout">
        <!-- <v-icon left>mdi-logout</v-icon> -->
         LOGOUT
      </v-btn>
      
    </v-app-bar>
  </template>

<script setup>
// import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
// import {kakaoAuthenticationStore} from "../../kakaoAuthentication/stores/kakaoAuthenticationStore"
// import { kakaoAuthenticationState } from '../../kakaoAuthentication/stores/kakaoAuthenticationState';

// const router = useRouter()
// const route = userRoute()
// const kakaoAuthenticationStore = kakaoAuthenticationStore();
// const isAuthenticatedKakao = computed(()=>kakaoAuthenticationStore.isAuthenticatedKakao);
// const is
</script>