<template>
  <div class="upload">
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
        <v-row class="pb-2 d-flex">
          <div>
            <v-btn class="mx-3" @click="submit">Nahrát</v-btn>
          </div>
          <div class="flex-grow-1 d-flex flex-column justify-center">
            <v-progress-linear :value="progress"></v-progress-linear>
          </div>
        </v-row>
      </v-container>
    </v-form>
    
    <v-btn
      fab
      large
      dark
      bottom
      right
      fixed
      class="v-btn--example"
      router
      :to="{
        name: 'Babybox',
        params: {
          name: this.$route.params.name
        }
      }"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
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
    },
    progress: 100,
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
      this.progress = 0
      if (this.form.image != null) {
        let formData = new FormData();
        formData.append("name", this.form.name);
        formData.append("babyboxName", this.babybox.name);
        formData.append("image", this.form.image);
        console.log("sending")
        axios
        .post(`babybox/${ this.babybox._id }/gallery`, formData, { 
        onUploadProgress: uploadEvent => {
          this.progress = Math.round(uploadEvent.loaded / uploadEvent.total * 100)
        }})
        .then(response => {
          this.progress = 100

          this.snackbar.text = "Nahrávání obrázku proběhlo správně."
          this.snackbar.color = "success"
          this.snackbar.colorBtn = "white"
          this.snackbar.show = true
        })
        .catch(err => {
          console.log(err)
          this.progress = 100

          this.snackbar.text = "Došlo k chybě při nahrávání obrázku."
          this.snackbar.color = "error"
          this.snackbar.colorBtn = "white"
          this.snackbar.show = true
        })
      }
    }
  },
};
</script>

<style lang="scss">
</style>
