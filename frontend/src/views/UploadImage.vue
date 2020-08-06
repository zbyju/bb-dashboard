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
        <h2 class="mx-3">Nahrát obrázek</h2>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="form.name"
              label="Název">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input accept="image/*" label="Obrázek" ref="image" v-model="form.image"></v-file-input>
          </v-col>
        </v-row>
        <v-row class="pb-2">
          <v-btn class="mx-3" @click="submit">Nahrát</v-btn>
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
    form: {
      name: "",
      image: null,
    },
    snackbar: {
      show: false,
      text: '',
      color: '',
      colorBtn: '',
      timeout: 10000
    }
  }),
  computed: {
    babybox() {
      return this.$store.state.babybox.active
    }
  },
  async mounted() {
    await this.$store.dispatch("getBabybox", {
      name: this.$route.params.name
    })
  },
  methods: {
    submit: async function() {
      if (this.form.image != null) {
        let formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("babyboxName", this.babybox.name);
        formData.append("image", this.form.image);
        console.log("sending")
        axios
        .post(`babybox/${ this.babybox._id }/gallery`,
              formData)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  },
};
</script>

<style lang="scss">
</style>
