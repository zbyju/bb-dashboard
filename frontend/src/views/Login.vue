<template>
  <div class="login">
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      <span>{{ snackbar.text }}</span>
      <v-btn
        :color="snackbar.colorBtn"
        text
        @click="snackbar.show = false"
      >
        Zavřít
      </v-btn>
    </v-snackbar>

    <v-form>
      <v-container class="main mt-10">
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="loginData.username"
              label="Uživatelské jméno">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="loginData.password"
              type="password"
              label="Heslo">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="pb-2">
          <v-btn class="mx-3" @click="submit">Přihlásit se</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import axios from "axios"

export default {
  name: "Login",
  data: () => ({
    loginData: {
      username: "",
      password: ""
    },
    snackbar: {
      show: false,
      text: '',
      color: '',
      colorBtn: '',
      timeout: 10000
    }
  }),
  methods: {
    submit: async function() {
      try {
        let result = await this.login()
        localStorage.setItem("auth", JSON.stringify(result.auth))
        this.$store.commit("login")

        this.snackbar.text = "Přihlášení proběhlo v pořádku."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true

        setTimeout(() => {
          this.$router.push("/")
        }, 1000)

      } catch(err) {
        this.snackbar.text = err.response.data.msg
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      }
    },
    login: async function() {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: "auth/login",
          data: this.loginData
        })
        .then(response => response.data)
        .then(payload => {
          resolve(payload)
        })
        .catch(err => {
          reject(err)
        })
      })
    }
  },
};
</script>

<style lang="scss">
.login {
  .main {
    max-width: 500px;
  }
}
</style>
