<template>
  <div class="logout">
      <v-container class="main mt-10">
        <v-row>
          <v-col>
            <h1>Odhlášení proběhlo úspěšně.</h1>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>
<script>
export default {
  name: "Login",
  data: () => ({

  }),
  computed: {
    auth() {
      return localStorage.getItem("auth")
    }
  },
  mounted() {
    localStorage.setItem("auth", null)
    this.$store.commit("logout")
  }
};
</script>

<style lang="scss">
.login {
  .main {
    max-width: 500px;
  }
}
</style>
