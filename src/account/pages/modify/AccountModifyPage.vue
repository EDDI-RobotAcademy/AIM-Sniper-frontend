<template>
  <div class="background">
  <v-container class="container">
    <v-card class="change-card" max-width="500" min-height="600">
      <v-card-title class="title">Profile Settings</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- Conditionally render password fields based on generalLogin -->
          <template v-if="isAuthenticatedNormal">
            <v-text-field
              v-model="currentPassword"
              label="Current Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="togglePasswordVisibility"
              :rules="[rules.required]"
              :error-messages="passwordErrorMessage"
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="New Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="togglePasswordVisibility"
              :rules="passwordRules"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              label="Confirm New Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="togglePasswordVisibility"
              :rules="[rules.required, rules.matchPassword]"
            ></v-text-field>

            <v-btn class="mt-4" color=#212121 @click="validateAndChangePassword">
              Change Password
            </v-btn>

            <v-divider class="mt-4 mb-4"></v-divider>
          </template>

          <v-text-field
            v-model="newNickname"
            label="New Nickname"
            :rules="[rules.required]"
            @input="updateValidState"
            :error-messages="nicknameErrorMessages"
          ></v-text-field>

          <v-btn class="mt-4" color=#212121 @click="validateAndChangeNickname">
            Change Nickname
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</div>
</template>

<script>
import "@mdi/font/css/materialdesignicons.css";
import router from "@/router";
import { mapActions, mapState } from "vuex";

const accountModule = "accountModule";

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      newNickname: '',
      valid: false, // Track form validity
      showPassword: false,
      isPasswordValid: false,
      isNicknameValid: false,
      passwordErrorMessage: '',
      nicknameErrorMessages: '',
      isGeneralLogin: false, // Add this flag to determine if generalLogin exists
      rules: {
        required: value => !!value || 'Required.',
        matchPassword: value => value === this.newPassword || 'Passwords do not match',
      },
    };
  },
  computed: {
    passwordRules() {
      return [
        this.rules.required,
        v => v.length >= 8 || 'Password must be at least 8 characters long.',
        v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter.',
        v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Password must contain at least one special character.',
      ];
    },
    ...mapState(accountModule, ["loginType", "isAuthenticatedNormal"]),
  },
  created() {
    // Check if generalLogin exists in localStorage
    this.isGeneralLogin = !!sessionStorage.getItem('generalLogin');
  },
  methods: {
    ...mapActions(accountModule, [
      'requestAccountCheckToDjango',
      'requestPasswordModifyToDjango',
      'requestNicknameModifyToDjango',
      'requestNicknameDuplicationCheckToDjango',
    ]),
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async checkPassword() {
      try {
        const isAccountCheck = await this.requestAccountCheckToDjango({
          email: sessionStorage.getItem('email'),
          password: this.currentPassword,
        });

        if (isAccountCheck) {
          this.passwordErrorMessage = ''; // Clear the error message if the password is correct
          this.isPasswordValid = true;
        } else {
          this.passwordErrorMessage = '현재 비밀번호가 틀렸습니다.';
          this.isPasswordValid = false;
        }
      } catch (error) {
        this.passwordErrorMessage = '비밀번호 확인에 실패했습니다.';
        this.isPasswordValid = false;
      }
    },
    async validateAndChangePassword() {
      await this.checkPassword();

      if (!this.isPasswordValid) {
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert('변경 비밀번호가 일치하지 않습니다.');
        return;
      }

      if (confirm("비밀번호를 변경하시겠습니까?")) {
        this.onChangePassword();
      }
    },
    onChangePassword() {
      this.requestPasswordModifyToDjango({
        email: sessionStorage.getItem('email'),
        newPassword: this.newPassword,
      })
        .then(() => {
          this.$router.push('/account/login');
          sessionStorage.removeItem('loginType');
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('normalToken');
          this.$store.state.accountModule.isAuthenticatedNormal = false;
          alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인을 진행해주세요');
        })
        .catch(err => {
          console.error('Failed to change password:', err);
        });
    },
    onChangeNickname() {
      if (this.newNickname) {
        this.requestNicknameModifyToDjango({
          email: sessionStorage.getItem('email'),
          newNickname: this.newNickname,
        })
          .then(() => {
            this.$router.push('/');
            alert("닉네임이 성공적으로 변경되었습니다.")
          })
          .catch(err => {
            console.error('Failed to change nickname:', err);
          });
      }
    },
    async checkNicknameDuplication() {
      console.log('닉네임 중복 검사');

      try {
        const isDuplicate = await this.requestNicknameDuplicationCheckToDjango({
          newNickname: this.newNickname.trim()
        });
        console.log(isDuplicate);
        if (isDuplicate) {
          this.nicknameErrorMessages = ['이 nickname은 이미 사용중입니다!'];
          this.isNicknameValid = false;
        } else {
          this.nicknameErrorMessages = [];
          this.isNicknameValid = true;
        }
      } catch (error) {
        alert('닉네임 중복 확인에 실패했습니다!');
        this.isNicknameValid = false;
      }
    },
    async validateAndChangeNickname() {
      await this.checkNicknameDuplication();

      if (!this.isNicknameValid) {
        return;
      }

      if (confirm("닉네임을 변경하시겠습니까?")) {
        this.onChangeNickname();
      }
    },
    updateValidState() {
      this.valid = !!this.newNickname; // Check if the nickname field is not empty
    },
    goToHome() {
      this.$router.push("/");
    },
    goToBack() {
      this.$router.push("/account/my")
    }
  },
};
</script>

<style scoped>
.background{
  background-color: #212121;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #212121;
}

.change-card {
  padding: 10vh;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  background-color: #292828;
  color:aliceblue;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.v-divider {
  margin: 20px 0;
}
</style>
