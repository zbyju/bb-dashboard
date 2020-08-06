<template>
  <div class="register">

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
        <h2 class="mx-3">Registrace</h2>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="user.username"
              label="Uživatelské jméno">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="user.password"
              type="password"
              label="Heslo">
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              v-model="user.password2"
              type="password"
              label="Heslo znovu">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="user.email"
              label="Emailová adresa">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="pb-2">
          <v-btn class="mx-3" @click="submit">Registrovat</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    user: {
        username: "",
        password: "",
        password2: "",
        email: "",
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
      console.log("registrace")
      try {
        await this.$store.dispatch("createUser", this.user)

        this.snackbar.text = "Vytvoření uživatele proběhlo správně."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      } catch(err) {
        this.snackbar.text = "Vyskytla se chyba při ukládání informací o babyboxu."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        this.snackbar.show = true
      }
    }
  },
};
</script>

<style lang="scss">
</style>
