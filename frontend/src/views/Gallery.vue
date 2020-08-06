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
              v-model="form.name"
              label="Název">
            </v-text-field>
          </v-col>
          <v-col>
            <v-file-input accept="image/*" label="Obrázek"></v-file-input>
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
    form: {
        username: "",
        password: "",
        password2: "",
        email: "",
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
