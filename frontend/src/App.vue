<template>
  <v-app>

    <Navbar />

      <v-content>
        <router-view />
      </v-content>

    <Footer />

  </v-app>
</template>

<script>
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },

  data: () => ({
    
  })
};
</script>

<style>
@import './assets/css/colors.css';
@import './assets/css/styles.css';
</style>
